export type ResourceType = "Meeting Room" | "Projector" | "Vehicle" | "Other";
export type BookingStatus = "Booked" | "In Progress" | "Completed" | "Cancelled" | "Conflict";

export interface BookableResource {
  id: string;
  name: string;
  type: ResourceType;
  capacity: number | null;
  location: string;
  status: "Available" | "In Use" | "Maintenance";
  imageUrl?: string;
}

export interface Booking {
  id: string;
  resourceId: string;
  title: string;
  bookedBy: string;
  department: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h)
  endTime: string; // HH:mm (24h)
  status: BookingStatus;
  purpose: string;
  attendees: number;
}

export const mockResources: BookableResource[] = [
  // Meeting Rooms (6)
  { id: "r1", name: "Conference Room B2", type: "Meeting Room", capacity: 12, location: "HQ Floor 2", status: "Available" },
  { id: "r2", name: "Meeting Room A1", type: "Meeting Room", capacity: 6, location: "HQ Floor 1", status: "Available" },
  { id: "r3", name: "Boardroom Executive", type: "Meeting Room", capacity: 20, location: "HQ Floor 4", status: "In Use" },
  { id: "r4", name: "Huddle Space C", type: "Meeting Room", capacity: 4, location: "HQ Floor 2", status: "Available" },
  { id: "r5", name: "Design Studio", type: "Meeting Room", capacity: 8, location: "HQ Floor 3", status: "Available" },
  { id: "r6", name: "Training Room 1", type: "Meeting Room", capacity: 30, location: "Ground Floor", status: "Maintenance" },
  // Projectors (5)
  { id: "p1", name: "Projector P01 - Epson", type: "Projector", capacity: null, location: "IT Storage", status: "Available" },
  { id: "p2", name: "Projector P02 - Sony", type: "Projector", capacity: null, location: "IT Storage", status: "In Use" },
  { id: "p3", name: "Projector P03 - BenQ", type: "Projector", capacity: null, location: "HQ Floor 2", status: "Available" },
  { id: "p4", name: "Projector P04 - Epson 4K", type: "Projector", capacity: null, location: "Boardroom", status: "Available" },
  { id: "p5", name: "Portable Screen + Projector", type: "Projector", capacity: null, location: "Warehouse", status: "Available" },
  // Vehicles (2)
  { id: "v1", name: "Ford Transit Van", type: "Vehicle", capacity: 2, location: "Parking Bay 4", status: "Available" },
  { id: "v2", name: "Toyota Prius (Company Car)", type: "Vehicle", capacity: 5, location: "Parking Bay 2", status: "In Use" },
];

const today = new Date().toISOString().split("T")[0];

export const mockBookings: Booking[] = [
  {
    id: "b1",
    resourceId: "r1", // Conference Room B2
    title: "Quarterly Planning",
    bookedBy: "Sarah Jenkins",
    department: "Marketing",
    date: today,
    startTime: "09:00",
    endTime: "10:30",
    status: "Completed",
    purpose: "Q3 Campaign Planning",
    attendees: 8,
  },
  {
    id: "b2",
    resourceId: "r1", // Conference Room B2
    title: "Procurement Sync",
    bookedBy: "Michael Chang",
    department: "Finance",
    date: today,
    startTime: "11:00",
    endTime: "12:00",
    status: "Booked",
    purpose: "Vendor budget review",
    attendees: 4,
  },
  {
    id: "b3",
    resourceId: "r1", // Conference Room B2
    title: "Engineering All Hands",
    bookedBy: "Aditi Rao",
    department: "Engineering",
    date: today,
    startTime: "13:00",
    endTime: "15:00",
    status: "Booked",
    purpose: "Architecture presentation",
    attendees: 12,
  },
  {
    id: "b4",
    resourceId: "r1", // Conference Room B2 (CONFLICT DEMO)
    title: "Design Review",
    bookedBy: "David Chen",
    department: "Marketing",
    date: today,
    startTime: "14:30",
    endTime: "15:30",
    status: "Conflict",
    purpose: "Overlaps with Engineering All Hands",
    attendees: 5,
  },
  {
    id: "b5",
    resourceId: "r2",
    title: "1:1 Review",
    bookedBy: "Sana Iqbal",
    department: "HR",
    date: today,
    startTime: "10:00",
    endTime: "11:00",
    status: "Completed",
    purpose: "Performance review",
    attendees: 2,
  },
  {
    id: "b6",
    resourceId: "r2",
    title: "Interviews",
    bookedBy: "Sana Iqbal",
    department: "HR",
    date: today,
    startTime: "13:30",
    endTime: "16:30",
    status: "Booked",
    purpose: "Candidate interviews",
    attendees: 3,
  },
  {
    id: "b7",
    resourceId: "v1", // Van
    title: "Equipment Delivery",
    bookedBy: "Tom Hardy",
    department: "Operations",
    date: today,
    startTime: "08:00",
    endTime: "12:00",
    status: "Completed",
    purpose: "Deliver new monitors to branch office",
    attendees: 1,
  },
  {
    id: "b8",
    resourceId: "v2", // Prius
    title: "Client Site Visit",
    bookedBy: "Sarah Jenkins",
    department: "Marketing",
    date: today,
    startTime: "13:00",
    endTime: "17:00",
    status: "In Progress",
    purpose: "Meet with XYZ Corp",
    attendees: 2,
  },
  {
    id: "b9",
    resourceId: "p2", // Projector P02
    title: "Offsite Presentation",
    bookedBy: "David Chen",
    department: "Marketing",
    date: today,
    startTime: "09:00",
    endTime: "17:00",
    status: "In Progress",
    purpose: "Using for offsite event",
    attendees: 0,
  }
];
