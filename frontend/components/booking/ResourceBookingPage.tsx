"use client";

import React, { useState, useMemo } from "react";
import { BookingHeader } from "./BookingHeader";
import { ResourceSelector } from "./ResourceSelector";
import { BookingTimeline } from "./BookingTimeline";
import { ResourceDetailsCard } from "./ResourceDetailsCard";
import { BookingDialog } from "./BookingDialog";
import { mockResources, mockBookings, Booking } from "./mockData";

export function ResourceBookingPage() {
  const [selectedResourceId, setSelectedResourceId] = useState<string>(mockResources[0].id);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  // Derived state
  const selectedResource = useMemo(() => 
    mockResources.find(r => r.id === selectedResourceId), 
  [selectedResourceId]);

  const filteredBookings = useMemo(() => 
    bookings.filter(b => b.resourceId === selectedResourceId && b.date === selectedDate),
  [bookings, selectedResourceId, selectedDate]);

  const handleBookResource = () => {
    setIsBookingOpen(true);
  };

  const handleSaveBooking = (data: any) => {
    const newBooking: Booking = {
      ...data,
      id: `b${Date.now()}`,
      title: data.purpose,
      bookedBy: "Current User", // Mock user
      status: "Booked",
    };
    setBookings([...bookings, newBooking]);
  };

  return (
    <div className="w-full h-full max-w-[1600px] mx-auto flex flex-col pt-6 pb-12 px-4 sm:px-6 lg:px-8">
      <BookingHeader onBookClick={handleBookResource} />
      
      <ResourceSelector 
        resources={mockResources}
        selectedResourceId={selectedResourceId}
        onResourceChange={setSelectedResourceId}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
        {/* Left Side: Timeline (70%) */}
        <div className="w-full lg:w-[70%] h-full">
          <BookingTimeline bookings={filteredBookings} />
        </div>

        {/* Right Side: Details & Upcoming (30%) */}
        <div className="w-full lg:w-[30%] h-full min-h-[500px]">
          <ResourceDetailsCard 
            resource={selectedResource}
            todayBookings={filteredBookings}
          />
        </div>
      </div>

      <BookingDialog 
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        resources={mockResources}
        selectedResourceId={selectedResourceId}
        selectedDate={selectedDate}
        onSave={handleSaveBooking}
      />
    </div>
  );
}
