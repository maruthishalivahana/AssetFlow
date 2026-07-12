import { z } from 'zod';

export const createBookingSchema = z.object({
    resourceId: z.string().uuid({ message: 'Resource is required' }),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date is required' }),
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Start Time is required' }),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'End Time is required' }),
    title: z.string().min(1, 'Title is required'),
    purpose: z.string().optional(),
    departmentId: z.string().uuid().optional(),
    attendees: z.number().int().positive(),
    notes: z.string().optional(),
});

export const updateBookingSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date is required' }).optional(),
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Start Time is required' }).optional(),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'End Time is required' }).optional(),
    title: z.string().min(1, 'Title is required').optional(),
    purpose: z.string().optional(),
    departmentId: z.string().uuid().optional(),
    attendees: z.number().int().positive().optional(),
    notes: z.string().optional(),
    status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
});

export const listBookingSchema = z.object({
    resourceId: z.string().uuid().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be yyyy-mm-dd' }).optional(),
    status: z.enum(['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
    departmentId: z.string().uuid().optional(),
    query: z.string().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
});
