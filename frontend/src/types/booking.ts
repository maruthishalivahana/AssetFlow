export type BookingStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface BookingResource {
    id: string;
    name: string;
    type: string;
    capacity?: number | null;
    location: string;
    status: string;
    description?: string | null;
    department?: {
        id: string;
        name: string;
        code: string;
    } | null;
}

export interface Department {
    id: string;
    name: string;
    code: string;
}

export interface BookingItem {
    id: string;
    resourceId: string;
    title: string;
    purpose?: string | null;
    department?: string;
    departmentId?: string | null;
    date: string;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    attendees: number;
    notes?: string | null;
    bookedBy?: string;
}

export interface BookingCreatePayload {
    resourceId: string;
    date: string;
    startTime: string;
    endTime: string;
    title: string;
    purpose?: string;
    departmentId?: string;
    attendees: number;
    notes?: string;
}

export interface BookingListParams {
    resourceId?: string;
    date?: string;
    status?: BookingStatus;
    departmentId?: string;
    query?: string;
    page?: number;
    limit?: number;
}
