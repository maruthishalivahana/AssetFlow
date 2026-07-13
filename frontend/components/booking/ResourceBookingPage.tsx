"use client";

import React, { useState, useMemo, useEffect } from "react";
import { BookingHeader } from "./BookingHeader";
import { ResourceSelector } from "./ResourceSelector";
import { BookingTimeline } from "./BookingTimeline";
import { ResourceDetailsCard } from "./ResourceDetailsCard";
import { BookingDialog } from "./BookingDialog";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchBookingResources, fetchBookings, createBooking } from "@/src/store/slices/bookingSlice";
import type { BookingItem, BookingResource, BookingCreatePayload } from "@/src/types/booking";

export function ResourceBookingPage() {
  const dispatch = useAppDispatch();
  const [selectedResourceId, setSelectedResourceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const { resources, bookings, loading, error } = useAppSelector((state) => state.bookings as { resources: BookingResource[]; bookings: BookingItem[]; loading: boolean; error?: string | null });

  useEffect(() => {
    dispatch(fetchBookingResources());
  }, [dispatch]);

  useEffect(() => {
    if (selectedResourceId) {
      dispatch(fetchBookings({ resourceId: selectedResourceId, date: selectedDate }));
    }
  }, [dispatch, selectedResourceId, selectedDate]);

  useEffect(() => {
    if (!selectedResourceId && resources.length > 0) {
      setSelectedResourceId(resources[0].id);
    }
  }, [resources, selectedResourceId]);

  const selectedResource = useMemo(
    () => resources.find((resource) => resource.id === selectedResourceId),
    [resources, selectedResourceId],
  );

  const filteredBookings = useMemo(
    () => bookings.filter((booking) => booking.resourceId === selectedResourceId && booking.date === selectedDate),
    [bookings, selectedResourceId, selectedDate],
  );

  const handleBookResource = () => {
    setIsBookingOpen(true);
  };

  const handleSaveBooking = async (data: BookingCreatePayload) => {
    await dispatch(createBooking(data));
    dispatch(fetchBookings({ resourceId: selectedResourceId, date: selectedDate }));
  };

  return (
    <div className="w-full h-full max-w-[1600px] mx-auto flex flex-col pt-6 pb-12 px-4 sm:px-6 lg:px-8">
      <BookingHeader onBookClick={handleBookResource} />

      <ResourceSelector
        resources={resources}
        selectedResourceId={selectedResourceId}
        onResourceChange={setSelectedResourceId}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
        <div className="w-full lg:w-[70%] h-full">
          <BookingTimeline bookings={filteredBookings} />
          {loading && (
            <div className="mt-4 text-sm text-slate-400">Loading bookings…</div>
          )}
          {error && (
            <div className="mt-4 text-sm text-red-400">{error}</div>
          )}
        </div>

        <div className="w-full lg:w-[30%] h-full min-h-[500px]">
          <ResourceDetailsCard resource={selectedResource} todayBookings={filteredBookings} />
        </div>
      </div>

      <BookingDialog
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        resources={resources}
        selectedResourceId={selectedResourceId}
        selectedDate={selectedDate}
        onSave={handleSaveBooking}
      />
    </div>
  );
}
