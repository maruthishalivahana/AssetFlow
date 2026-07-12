import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { bookingsService } from './bookings.service';
import { createBookingSchema, listBookingSchema, updateBookingSchema } from './bookings.validation';
import { ApiError } from '@shared/errors/ApiError';

const parseBody = <T>(schema: z.ZodType<T>, value: unknown): T => {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new ApiError(400, 'Validation failed', result.error.format());
  }
  return result.data;
};

const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = parseBody(createBookingSchema, req.body);
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, 'Unauthorized');

    const booking = await bookingsService.createBooking({
      ...body,
      requestedByUserId: userId,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

const listBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = parseBody(listBookingSchema, req.query);
    const data = await bookingsService.listBookings(query);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingsService.getBookingById(req.params.id);
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

const updateBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = parseBody(updateBookingSchema, req.body);
    const booking = await bookingsService.updateBooking(req.params.id, body);
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingsService.cancelBooking(req.params.id);
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

const listResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await bookingsService.listResources();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await bookingsService.getResourceById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const bookingsController = {
  createBooking,
  listBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  listResources,
  getResource,
};
