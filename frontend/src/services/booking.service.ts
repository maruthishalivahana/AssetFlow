import api from './api';
import type { BookingCreatePayload, BookingItem, BookingListParams, BookingResource } from '../types/booking';

const normalizeBooking = (booking: any): BookingItem => {
    const start = new Date(booking.startAt);
    const end = new Date(booking.endAt);

    const pad = (value: number) => String(value).padStart(2, '0');

    return {
        id: booking.id,
        resourceId: booking.resourceId,
        title: booking.title,
        purpose: booking.purpose ?? null,
        departmentId: booking.departmentId ?? null,
        department: booking.department?.name ?? null,
        date: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`,
        startTime: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
        endTime: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
        status: booking.status,
        attendees: booking.attendees,
        notes: booking.notes ?? null,
        bookedBy: booking.requestedByUser ? `${booking.requestedByUser.firstName} ${booking.requestedByUser.lastName}` : undefined,
    };
};

const normalizeBookingsResponse = (data: any): { items: BookingItem[]; total: number; page: number; limit: number } => {
    return {
        items: Array.isArray(data.items) ? data.items.map(normalizeBooking) : [],
        total: data.total ?? 0,
        page: data.page ?? 1,
        limit: data.limit ?? 20,
    };
};

const listResources = async (): Promise<BookingResource[]> => {
    const res = await api.get('/bookings/resources');
    return res.data.data;
};

const getResource = async (id: string): Promise<BookingResource> => {
    const res = await api.get(`/bookings/resources/${id}`);
    return res.data.data;
};

const listBookings = async (params?: BookingListParams): Promise<{ items: BookingItem[]; total: number; page: number; limit: number }> => {
    const res = await api.get('/bookings', { params });
    return normalizeBookingsResponse(res.data.data);
};

const createBooking = async (payload: BookingCreatePayload): Promise<BookingItem> => {
    const res = await api.post('/bookings', payload);
    return normalizeBooking(res.data.data);
};

const updateBooking = async (id: string, payload: Partial<BookingCreatePayload> & { status?: string }): Promise<BookingItem> => {
    const res = await api.patch(`/bookings/${id}`, payload);
    return normalizeBooking(res.data.data);
};

const cancelBooking = async (id: string): Promise<BookingItem> => {
    const res = await api.delete(`/bookings/${id}`);
    return normalizeBooking(res.data.data);
};

const bookingService = {
    listResources,
    getResource,
    listBookings,
    createBooking,
    updateBooking,
    cancelBooking,
};

export default bookingService;
