import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import bookingService from '../../services/booking.service';
import type { BookingCreatePayload, BookingItem, BookingListParams, BookingResource } from '../../types/booking';

interface BookingState {
    resources: BookingResource[];
    bookings: BookingItem[];
    loading: boolean;
    error?: string | null;
    total: number;
    page: number;
    limit: number;
}

const initialState: BookingState = {
    resources: [],
    bookings: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 20,
};

export const fetchBookingResources = createAsyncThunk('booking/resources', async (_, { rejectWithValue }) => {
    try {
        const data = await bookingService.listResources();
        return data;
    } catch (err: any) {
        return rejectWithValue(err?.response?.data || err.message);
    }
});

export const fetchBookings = createAsyncThunk('booking/list', async (params: BookingListParams | undefined, { rejectWithValue }) => {
    try {
        const data = await bookingService.listBookings(params);
        return data;
    } catch (err: any) {
        return rejectWithValue(err?.response?.data || err.message);
    }
});

export const createBooking = createAsyncThunk('booking/create', async (payload: BookingCreatePayload, { rejectWithValue }) => {
    try {
        const data = await bookingService.createBooking(payload);
        return data;
    } catch (err: any) {
        return rejectWithValue(err?.response?.data || err.message);
    }
});

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        clearBookingError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookingResources.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookingResources.fulfilled, (state, action: PayloadAction<BookingResource[]>) => {
                state.loading = false;
                state.resources = action.payload;
            })
            .addCase(fetchBookingResources.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to load resources';
            })
            .addCase(fetchBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookings.fulfilled, (state, action: PayloadAction<{ items: BookingItem[]; total: number; page: number; limit: number }>) => {
                state.loading = false;
                state.bookings = action.payload.items || [];
                state.total = action.payload.total || 0;
                state.page = action.payload.page || 1;
                state.limit = action.payload.limit || state.limit;
            })
            .addCase(fetchBookings.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to load bookings';
            })
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action: PayloadAction<BookingItem>) => {
            })
            .addCase(createBooking.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to create booking';
            });
    },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
