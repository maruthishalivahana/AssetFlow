import { Prisma } from '@prisma/client';
import { prisma } from '@config/prisma';
import { ApiError } from '@shared/errors/ApiError';
import { CreateResourceBookingPayload, ResourceBookingFilters, UpdateResourceBookingPayload } from './bookings.types';

const toDateTime = (date: string, time: string): Date => {
    return new Date(`${date}T${time}:00.000Z`);
};

const validateBookingWindow = (start: Date, end: Date) => {
    if (start >= end) {
        throw new ApiError(400, 'End time must be after start time.');
    }
};

const hasOverlap = (existingStart: Date, existingEnd: Date, newStart: Date, newEnd: Date) => {
    return existingStart < newEnd && newStart < existingEnd;
};

const findOverlappingBooking = async (resourceId: string, startAt: Date, endAt: Date, excludeBookingId?: string) => {
    const bookings = await (prisma as any).resourceBooking.findMany({
        where: {
            resourceId,
            deletedAt: null,
            AND: [
                { status: { not: 'CANCELLED' } },
                { status: { not: 'COMPLETED' } },
                excludeBookingId ? { id: { not: excludeBookingId } } : {},
            ],
        },
        select: {
            id: true,
            startAt: true,
            endAt: true,
            title: true,
        },
    });

    return bookings.find((booking: any) => hasOverlap(booking.startAt, booking.endAt, startAt, endAt));
};

const listResources = async () => {
    const resources = await prisma.resource.findMany({
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
        include: { department: true },
    });
    return resources;
};

const getResourceById = async (id: string) => {
    const resource = await prisma.resource.findFirst({
        where: { id, deletedAt: null },
        include: { department: true },
    });

    if (!resource) {
        throw new ApiError(404, 'Resource not found');
    }

    return resource;
};

const listBookings = async (filters: ResourceBookingFilters) => {
    const where: any = {
        deletedAt: null,
        AND: [],
    };

    if (filters.resourceId) where.resourceId = filters.resourceId;
    if (filters.departmentId) where.departmentId = filters.departmentId;
    if (filters.status) where.status = filters.status as any;
    if (filters.date) {
        const date = new Date(filters.date);
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        where.startAt = { gte: startOfDay, lt: endOfDay };
    }

    if (filters.query) {
        where.OR = [
            { title: { contains: filters.query, mode: 'insensitive' } },
            { purpose: { contains: filters.query, mode: 'insensitive' } },
        ];
    }

    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        (prisma as any).resourceBooking.findMany({
            where,
            orderBy: { startAt: 'asc' },
            take: limit,
            skip,
            include: {
                resource: true,
                department: true,
                requestedByUser: true,
            },
        }),
        (prisma as any).resourceBooking.count({ where }),
    ]);

    return { items, total, page, limit };
};

const getBookingById = async (id: string) => {
    const booking = await (prisma as any).resourceBooking.findFirst({
        where: { id, deletedAt: null },
        include: {
            resource: true,
            department: true,
            requestedByUser: true,
            approvedByUser: true,
            history: true,
            notifications: true,
        },
    });

    if (!booking) throw new ApiError(404, 'Booking not found');
    return booking;
};

const createBooking = async (payload: CreateResourceBookingPayload) => {
    const startAt = toDateTime(payload.date, payload.startTime);
    const endAt = toDateTime(payload.date, payload.endTime);

    validateBookingWindow(startAt, endAt);

    const resource = await getResourceById(payload.resourceId);
    if (!resource) throw new ApiError(404, 'Resource not found');

    const overlap = await findOverlappingBooking(payload.resourceId, startAt, endAt);
    if (overlap) {
        throw new ApiError(409, `This slot overlaps with an existing booking (${overlap.title}, ${overlap.startAt.toISOString().slice(11, 16)} - ${overlap.endAt.toISOString().slice(11, 16)})`);
    }

    const booking = await (prisma as any).resourceBooking.create({
        data: {
            resourceId: payload.resourceId,
            requestedByUserId: payload.requestedByUserId,
            departmentId: payload.departmentId,
            title: payload.title,
            purpose: payload.purpose,
            attendees: payload.attendees,
            notes: payload.notes,
            startAt,
            endAt,
            status: 'UPCOMING',
        },
        include: {
            resource: true,
            department: true,
            requestedByUser: true,
        },
    });

    await (prisma as any).resourceBookingHistory.create({
        data: {
            bookingId: booking.id,
            eventType: 'CREATED',
            notes: 'Booking created',
        },
    });

    return booking;
};

const updateBooking = async (id: string, payload: UpdateResourceBookingPayload) => {
    const existing = await getBookingById(id);

    const updateData: Record<string, unknown> = {};

    if (payload.date || payload.startTime || payload.endTime) {
        const date = payload.date || existing.startAt.toISOString().slice(0, 10);
        const startTime = payload.startTime || existing.startAt.toISOString().slice(11, 16);
        const endTime = payload.endTime || existing.endAt.toISOString().slice(11, 16);
        const startAt = toDateTime(date, startTime);
        const endAt = toDateTime(date, endTime);

        validateBookingWindow(startAt, endAt);

        const overlap = await findOverlappingBooking(existing.resourceId, startAt, endAt, id);
        if (overlap) {
            throw new ApiError(409, `This slot overlaps with an existing booking (${overlap.title}, ${overlap.startAt.toISOString().slice(11, 16)} - ${overlap.endAt.toISOString().slice(11, 16)})`);
        }

        updateData.startAt = startAt;
        updateData.endAt = endAt;
    }

    if (payload.title !== undefined) updateData.title = payload.title;
    if (payload.purpose !== undefined) updateData.purpose = payload.purpose;
    if (payload.departmentId !== undefined) updateData.departmentId = payload.departmentId;
    if (payload.attendees !== undefined) updateData.attendees = payload.attendees;
    if (payload.notes !== undefined) updateData.notes = payload.notes;
    if (payload.status !== undefined) updateData.status = payload.status;

    const updated = await (prisma as any).resourceBooking.update({
        where: { id },
        data: updateData,
        include: {
            resource: true,
            department: true,
            requestedByUser: true,
            approvedByUser: true,
        },
    });

    await (prisma as any).resourceBookingHistory.create({
        data: {
            bookingId: updated.id,
            eventType: 'UPDATED',
            notes: 'Booking updated',
        },
    });

    return updated;
};

const cancelBooking = async (id: string) => {
    const booking = await getBookingById(id);

    if (booking.status === 'CANCELLED') {
        throw new ApiError(400, 'Booking is already cancelled');
    }

    const cancelled = await (prisma as any).resourceBooking.update({
        where: { id },
        data: {
            status: 'CANCELLED',
            cancelledAt: new Date(),
        },
        include: {
            resource: true,
            department: true,
            requestedByUser: true,
            approvedByUser: true,
        },
    });

    await (prisma as any).resourceBookingHistory.create({
        data: {
            bookingId: cancelled.id,
            eventType: 'CANCELLED',
            notes: 'Booking cancelled',
        },
    });

    return cancelled;
};

export const bookingsService = {
    listResources,
    getResourceById,
    listBookings,
    getBookingById,
    createBooking,
    updateBooking,
    cancelBooking,
};
