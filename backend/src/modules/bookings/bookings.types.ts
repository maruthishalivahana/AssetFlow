export interface ResourceBookingFilters {
    resourceId?: string;
    date?: string;
    status?: string;
    departmentId?: string;
    query?: string;
    page?: number;
    limit?: number;
}

export interface CreateResourceBookingPayload {
    resourceId: string;
    date: string;
    startTime: string;
    endTime: string;
    title: string;
    purpose?: string;
    departmentId?: string;
    attendees: number;
    notes?: string;
    requestedByUserId: string;
}

export interface UpdateResourceBookingPayload {
    date?: string;
    startTime?: string;
    endTime?: string;
    title?: string;
    purpose?: string;
    departmentId?: string;
    attendees?: number;
    notes?: string;
    status?: string;
}
