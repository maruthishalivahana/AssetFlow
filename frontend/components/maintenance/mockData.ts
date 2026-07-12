// ============================================================
// Maintenance Management – Mock Data & Types
// ============================================================

export type MaintenanceStatus =
  | "Pending"
  | "Approved"
  | "Assigned"
  | "In Progress"
  | "Resolved"
  | "Rejected";

export type MaintenancePriority = "Low" | "Medium" | "High" | "Critical";

export interface Technician {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
}

export interface MaintenanceTimelineEvent {
  id: string;
  event: string;
  actor: string;
  timestamp: string;
  note?: string;
}

export interface MaintenanceRequest {
  id: string;
  assetTag: string;
  assetName: string;
  assetCategory: string;
  department: string;
  currentHolder: string;
  issueTitle: string;
  issueDescription: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  reportedBy: string;
  technicianId?: string;
  estimatedCompletion?: string;
  repairCost?: number;
  resolutionNotes?: string;
  conditionAfterRepair?: string;
  createdAt: string;
  updatedAt: string;
  timeline: MaintenanceTimelineEvent[];
}

// ---- Technicians ----
export const mockTechnicians: Technician[] = [
  { id: "t1", name: "Ravi Varma", specialty: "Electronics & IT" },
  { id: "t2", name: "Meena Shetty", specialty: "HVAC & Facilities" },
  { id: "t3", name: "James O'Brien", specialty: "Vehicles & Heavy Equipment" },
  { id: "t4", name: "Priya Nair", specialty: "Networking & Infrastructure" },
  { id: "t5", name: "Carlos Mendez", specialty: "AV & Projectors" },
];

// ---- Helper ----
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

// ---- Maintenance Requests ----
export const mockMaintenanceRequests: MaintenanceRequest[] = [
  // ---- PENDING ----
  {
    id: "MR-001",
    assetTag: "AF-0062",
    assetName: "Epson Projector P01",
    assetCategory: "Projector",
    department: "Marketing",
    currentHolder: "Sarah Jenkins",
    issueTitle: "Projector bulb not turning on",
    issueDescription:
      "The projector powers on but the lamp does not illuminate. Tried resetting – no luck. Conference scheduled tomorrow.",
    priority: "High",
    status: "Pending",
    reportedBy: "Sarah Jenkins",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Sarah Jenkins", timestamp: daysAgo(1), note: "Projector bulb not turning on" },
    ],
  },
  {
    id: "MR-002",
    assetTag: "AF-0114",
    assetName: "HP LaserJet Printer",
    assetCategory: "Printer",
    department: "Finance",
    currentHolder: "Tom Hardy",
    issueTitle: "Printer paper jam – recurring",
    issueDescription:
      "Paper jams every 10–15 pages. Cleaning done but issue persists. Could be a roller fault.",
    priority: "Medium",
    status: "Pending",
    reportedBy: "Tom Hardy",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Tom Hardy", timestamp: daysAgo(2) },
    ],
  },
  {
    id: "MR-003",
    assetTag: "AF-0201",
    assetName: "MacBook Pro (Engineering Pool)",
    assetCategory: "Laptop",
    department: "Engineering",
    currentHolder: "Aditi Rao",
    issueTitle: "Keyboard unresponsive – keys 'R' and 'T' stuck",
    issueDescription:
      "Liquid spilled on keyboard. Keys R and T are physically stuck and unresponsive. Urgent – daily driver laptop.",
    priority: "Critical",
    status: "Pending",
    reportedBy: "Aditi Rao",
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Aditi Rao", timestamp: daysAgo(0) },
    ],
  },
  {
    id: "MR-004",
    assetTag: "AF-0332",
    assetName: "Cisco Switch (Floor 2)",
    assetCategory: "Network",
    department: "Operations",
    currentHolder: "IT Department",
    issueTitle: "Network switch overheating – port failures",
    issueDescription:
      "Switch is running hot. Ports 12–16 intermittently failing. Risk of network outage.",
    priority: "Critical",
    status: "Pending",
    reportedBy: "David Chen",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "David Chen", timestamp: daysAgo(3) },
    ],
  },
  {
    id: "MR-005",
    assetTag: "AF-0441",
    assetName: "Office Chair – Executive Suite",
    assetCategory: "Furniture",
    department: "Executive",
    currentHolder: "Board Room",
    issueTitle: "Chair hydraulic lift failing",
    issueDescription: "Chair gradually sinks after sitting. Hydraulic piston needs replacement.",
    priority: "Low",
    status: "Pending",
    reportedBy: "Sana Iqbal",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Sana Iqbal", timestamp: daysAgo(5) },
    ],
  },

  // ---- APPROVED ----
  {
    id: "MR-006",
    assetTag: "AF-0093",
    assetName: "LG Air Conditioner (Server Room)",
    assetCategory: "Facilities",
    department: "Operations",
    currentHolder: "Server Room",
    issueTitle: "AC unit – noisy compressor",
    issueDescription:
      "Loud rattling from AC compressor. Temperature control still working but noise is disruptive and indicates potential failure.",
    priority: "High",
    status: "Approved",
    reportedBy: "Michael Chang",
    estimatedCompletion: daysFromNow(3),
    createdAt: daysAgo(4),
    updatedAt: daysAgo(2),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Michael Chang", timestamp: daysAgo(4) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(2), note: "Priority approved – schedule technician" },
    ],
  },
  {
    id: "MR-007",
    assetTag: "AF-0289",
    assetName: "Dell Monitor 27\" (HR Dept)",
    assetCategory: "Electronics",
    department: "HR",
    currentHolder: "Sana Iqbal",
    issueTitle: "Monitor flickering at random intervals",
    issueDescription:
      "Screen flickers every few minutes. Tried changing cables – same issue. Likely a backlight fault.",
    priority: "Medium",
    status: "Approved",
    reportedBy: "Sana Iqbal",
    estimatedCompletion: daysFromNow(5),
    createdAt: daysAgo(6),
    updatedAt: daysAgo(1),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Sana Iqbal", timestamp: daysAgo(6) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(1) },
    ],
  },
  {
    id: "MR-008",
    assetTag: "AF-0511",
    assetName: "Canon Printer (Finance Floor)",
    assetCategory: "Printer",
    department: "Finance",
    currentHolder: "Finance Team",
    issueTitle: "Toner cartridge replacement & drum inspection",
    issueDescription:
      "Prints faded. New toner did not fix it – may be drum issue. Needs full inspection.",
    priority: "Low",
    status: "Approved",
    reportedBy: "Tom Hardy",
    estimatedCompletion: daysFromNow(7),
    createdAt: daysAgo(7),
    updatedAt: daysAgo(2),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Tom Hardy", timestamp: daysAgo(7) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(2) },
    ],
  },

  // ---- ASSIGNED ----
  {
    id: "MR-009",
    assetTag: "AF-0078",
    assetName: "Toyota Forklift FV01",
    assetCategory: "Vehicle",
    department: "Operations",
    currentHolder: "Warehouse Team",
    issueTitle: "Forklift hydraulic arm not lifting",
    issueDescription:
      "Hydraulic arm refuses to lift beyond 1.5m. Fluid level checked – OK. Likely solenoid valve fault.",
    priority: "High",
    status: "Assigned",
    reportedBy: "Carlos Mendez",
    technicianId: "t3",
    estimatedCompletion: daysFromNow(2),
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Carlos Mendez", timestamp: daysAgo(5) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(3) },
      { id: "e3", event: "Technician Assigned", actor: "Admin", timestamp: daysAgo(1), note: "James O'Brien assigned" },
    ],
  },
  {
    id: "MR-010",
    assetTag: "AF-0145",
    assetName: "Conference Room Display B2",
    assetCategory: "Electronics",
    department: "Executive",
    currentHolder: "Conference Room B2",
    issueTitle: "Display HDMI input not detecting laptop",
    issueDescription:
      "Board room display fails to detect HDMI from laptops. VGA port works. HDMI board likely failed.",
    priority: "High",
    status: "Assigned",
    reportedBy: "Sarah Jenkins",
    technicianId: "t1",
    estimatedCompletion: daysFromNow(1),
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Sarah Jenkins", timestamp: daysAgo(3) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(2) },
      { id: "e3", event: "Technician Assigned", actor: "Admin", timestamp: daysAgo(1), note: "Ravi Varma assigned" },
    ],
  },
  {
    id: "MR-011",
    assetTag: "AF-0377",
    assetName: "Aruba Wi-Fi Access Point (Floor 3)",
    assetCategory: "Network",
    department: "Engineering",
    currentHolder: "IT Department",
    issueTitle: "Access point intermittently dropping connections",
    issueDescription:
      "Users on Floor 3 face random Wi-Fi drops every hour. Access point needs firmware update and hardware check.",
    priority: "Medium",
    status: "Assigned",
    reportedBy: "Aditi Rao",
    technicianId: "t4",
    estimatedCompletion: daysFromNow(1),
    createdAt: daysAgo(4),
    updatedAt: daysAgo(1),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Aditi Rao", timestamp: daysAgo(4) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(2) },
      { id: "e3", event: "Technician Assigned", actor: "Admin", timestamp: daysAgo(1), note: "Priya Nair assigned" },
    ],
  },

  // ---- IN PROGRESS ----
  {
    id: "MR-012",
    assetTag: "AF-0897",
    assetName: "HP Color LaserJet (HR Dept)",
    assetCategory: "Printer",
    department: "HR",
    currentHolder: "HR Team",
    issueTitle: "Printer paper jam – parts ordered",
    issueDescription:
      "Recurring paper jam traced to faulty roller assembly. Replacement parts ordered and in transit.",
    priority: "Medium",
    status: "In Progress",
    reportedBy: "Sana Iqbal",
    technicianId: "t1",
    estimatedCompletion: daysFromNow(2),
    createdAt: daysAgo(8),
    updatedAt: daysAgo(0),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Sana Iqbal", timestamp: daysAgo(8) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(6) },
      { id: "e3", event: "Technician Assigned", actor: "Admin", timestamp: daysAgo(4), note: "Ravi Varma assigned" },
      { id: "e4", event: "Repair Started", actor: "Ravi Varma", timestamp: daysAgo(2) },
      { id: "e5", event: "Parts Ordered", actor: "Ravi Varma", timestamp: daysAgo(0), note: "Roller assembly parts ordered" },
    ],
  },
  {
    id: "MR-013",
    assetTag: "AF-0233",
    assetName: "Toyota Prius (Company Car)",
    assetCategory: "Vehicle",
    department: "Operations",
    currentHolder: "Operations Pool",
    issueTitle: "AC not cooling – refrigerant leak suspected",
    issueDescription:
      "Vehicle AC blowing warm air. Recharge didn't fix it. Likely refrigerant leak in compressor.",
    priority: "High",
    status: "In Progress",
    reportedBy: "Tom Hardy",
    technicianId: "t3",
    estimatedCompletion: daysFromNow(3),
    createdAt: daysAgo(10),
    updatedAt: daysAgo(1),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Tom Hardy", timestamp: daysAgo(10) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(7) },
      { id: "e3", event: "Technician Assigned", actor: "Admin", timestamp: daysAgo(5), note: "James O'Brien assigned" },
      { id: "e4", event: "Repair Started", actor: "James O'Brien", timestamp: daysAgo(2) },
    ],
  },
  {
    id: "MR-014",
    assetTag: "AF-0412",
    assetName: "Sony Projector P02",
    assetCategory: "Projector",
    department: "Marketing",
    currentHolder: "IT Storage",
    issueTitle: "Projector fan loud – overheating warning",
    issueDescription:
      "Fan sounds strained and projector throws thermal warning. Dust buildup internally causing overheating.",
    priority: "Medium",
    status: "In Progress",
    reportedBy: "David Chen",
    technicianId: "t5",
    estimatedCompletion: daysFromNow(1),
    createdAt: daysAgo(6),
    updatedAt: daysAgo(1),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "David Chen", timestamp: daysAgo(6) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(4) },
      { id: "e3", event: "Technician Assigned", actor: "Admin", timestamp: daysAgo(3), note: "Carlos Mendez assigned" },
      { id: "e4", event: "Repair Started", actor: "Carlos Mendez", timestamp: daysAgo(1), note: "Internal cleaning in progress" },
    ],
  },
  {
    id: "MR-015",
    assetTag: "AF-0590",
    assetName: "Standing Desk Motor (Eng. Area)",
    assetCategory: "Furniture",
    department: "Engineering",
    currentHolder: "Engineering Pool",
    issueTitle: "Height adjustment motor not working",
    issueDescription:
      "Electric standing desk motor stopped responding. Control panel shows error E3.",
    priority: "Low",
    status: "In Progress",
    reportedBy: "Aditi Rao",
    technicianId: "t2",
    estimatedCompletion: daysFromNow(2),
    createdAt: daysAgo(9),
    updatedAt: daysAgo(1),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Aditi Rao", timestamp: daysAgo(9) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(7) },
      { id: "e3", event: "Technician Assigned", actor: "Admin", timestamp: daysAgo(4), note: "Meena Shetty assigned" },
      { id: "e4", event: "Repair Started", actor: "Meena Shetty", timestamp: daysAgo(1) },
    ],
  },

  // ---- RESOLVED ----
  {
    id: "MR-016",
    assetTag: "AF-0873",
    assetName: "Executive Conference Chair (set of 3)",
    assetCategory: "Furniture",
    department: "Executive",
    currentHolder: "Board Room",
    issueTitle: "Chair repair – resolved 7 Jul",
    issueDescription:
      "Wheel casters broken on 3 chairs. Replaced all 12 casters and tightened screws on armrests.",
    priority: "Low",
    status: "Resolved",
    reportedBy: "Sana Iqbal",
    technicianId: "t2",
    repairCost: 180,
    resolutionNotes: "All 12 casters replaced. Chairs fully functional.",
    conditionAfterRepair: "Good",
    estimatedCompletion: daysFromNow(-2),
    createdAt: daysAgo(14),
    updatedAt: daysAgo(2),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Sana Iqbal", timestamp: daysAgo(14) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(12) },
      { id: "e3", event: "Technician Assigned", actor: "Admin", timestamp: daysAgo(10), note: "Meena Shetty assigned" },
      { id: "e4", event: "Repair Started", actor: "Meena Shetty", timestamp: daysAgo(5) },
      { id: "e5", event: "Repair Completed", actor: "Meena Shetty", timestamp: daysAgo(2), note: "All casters replaced" },
      { id: "e6", event: "Asset Returned", actor: "Admin", timestamp: daysAgo(2) },
    ],
  },
  {
    id: "MR-017",
    assetTag: "AF-0003",
    assetName: "Conference Room Projector A1",
    assetCategory: "Projector",
    department: "Marketing",
    currentHolder: "Marketing",
    issueTitle: "Projector lens dust causing blurry image",
    issueDescription: "Image blurry after cleaning – lens had internal dust. Sent for professional cleaning.",
    priority: "Medium",
    status: "Resolved",
    reportedBy: "Sarah Jenkins",
    technicianId: "t5",
    repairCost: 95,
    resolutionNotes: "Internal lens cleaned. Image quality restored to factory standard.",
    conditionAfterRepair: "Excellent",
    createdAt: daysAgo(20),
    updatedAt: daysAgo(4),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Sarah Jenkins", timestamp: daysAgo(20) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(18) },
      { id: "e3", event: "Technician Assigned", actor: "Admin", timestamp: daysAgo(15), note: "Carlos Mendez assigned" },
      { id: "e4", event: "Repair Started", actor: "Carlos Mendez", timestamp: daysAgo(10) },
      { id: "e5", event: "Parts Ordered", actor: "Carlos Mendez", timestamp: daysAgo(8) },
      { id: "e6", event: "Repair Completed", actor: "Carlos Mendez", timestamp: daysAgo(4) },
      { id: "e7", event: "Asset Returned", actor: "Admin", timestamp: daysAgo(4) },
    ],
  },
  {
    id: "MR-018",
    assetTag: "AF-0188",
    assetName: "MacBook Pro (Marketing)",
    assetCategory: "Laptop",
    department: "Marketing",
    currentHolder: "David Chen",
    issueTitle: "Battery not charging – swollen battery",
    issueDescription: "Battery stopped holding charge. Visibly swollen. Safety issue – replaced immediately.",
    priority: "Critical",
    status: "Resolved",
    reportedBy: "David Chen",
    technicianId: "t1",
    repairCost: 340,
    resolutionNotes: "Swollen battery safely replaced. Device tested for 48h – charging normally.",
    conditionAfterRepair: "Good",
    createdAt: daysAgo(30),
    updatedAt: daysAgo(7),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "David Chen", timestamp: daysAgo(30) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(29) },
      { id: "e3", event: "Technician Assigned", actor: "Admin", timestamp: daysAgo(28) },
      { id: "e4", event: "Repair Started", actor: "Ravi Varma", timestamp: daysAgo(15) },
      { id: "e5", event: "Parts Ordered", actor: "Ravi Varma", timestamp: daysAgo(14) },
      { id: "e6", event: "Repair Completed", actor: "Ravi Varma", timestamp: daysAgo(7) },
      { id: "e7", event: "Asset Returned", actor: "Admin", timestamp: daysAgo(7) },
    ],
  },
  {
    id: "MR-019",
    assetTag: "AF-0622",
    assetName: "Cisco Router (Floor 1)",
    assetCategory: "Network",
    department: "Operations",
    currentHolder: "IT Department",
    issueTitle: "Router overheating – fan failure",
    issueDescription: "Router fan seized. CPU temps at 98°C. Risk of data loss. Emergency repair.",
    priority: "Critical",
    status: "Resolved",
    reportedBy: "Aditi Rao",
    technicianId: "t4",
    repairCost: 220,
    resolutionNotes: "Fan replaced, thermal paste reapplied. Running at 45°C.",
    conditionAfterRepair: "Good",
    createdAt: daysAgo(25),
    updatedAt: daysAgo(10),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Aditi Rao", timestamp: daysAgo(25) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(24) },
      { id: "e3", event: "Technician Assigned", actor: "Admin", timestamp: daysAgo(23) },
      { id: "e4", event: "Repair Started", actor: "Priya Nair", timestamp: daysAgo(14) },
      { id: "e5", event: "Repair Completed", actor: "Priya Nair", timestamp: daysAgo(10) },
      { id: "e6", event: "Asset Returned", actor: "Admin", timestamp: daysAgo(10) },
    ],
  },
  {
    id: "MR-020",
    assetTag: "AF-0704",
    assetName: "Ford Transit Van",
    assetCategory: "Vehicle",
    department: "Operations",
    currentHolder: "Operations Pool",
    issueTitle: "Brake pad replacement – scheduled service",
    issueDescription: "Front brake pads worn to minimum. Replaced both front and rear sets.",
    priority: "High",
    status: "Resolved",
    reportedBy: "Tom Hardy",
    technicianId: "t3",
    repairCost: 520,
    resolutionNotes: "All 4 brake pads replaced. Rotors inspected – acceptable wear.",
    conditionAfterRepair: "Excellent",
    createdAt: daysAgo(18),
    updatedAt: daysAgo(8),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Tom Hardy", timestamp: daysAgo(18) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(16) },
      { id: "e3", event: "Technician Assigned", actor: "Admin", timestamp: daysAgo(14) },
      { id: "e4", event: "Repair Started", actor: "James O'Brien", timestamp: daysAgo(10) },
      { id: "e5", event: "Repair Completed", actor: "James O'Brien", timestamp: daysAgo(8) },
      { id: "e6", event: "Asset Returned", actor: "Admin", timestamp: daysAgo(8) },
    ],
  },
  // 5 more for variety
  {
    id: "MR-021",
    assetTag: "AF-0815",
    assetName: "BenQ Projector P03",
    assetCategory: "Projector",
    department: "Engineering",
    currentHolder: "Engineering Team",
    issueTitle: "Remote control not pairing",
    issueDescription: "Projector remote won't pair after battery change. Infrared sensor check needed.",
    priority: "Low",
    status: "Pending",
    reportedBy: "Aditi Rao",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Aditi Rao", timestamp: daysAgo(1) },
    ],
  },
  {
    id: "MR-022",
    assetTag: "AF-0099",
    assetName: "Surface Pro (HR)",
    assetCategory: "Laptop",
    department: "HR",
    currentHolder: "Sana Iqbal",
    issueTitle: "Display crack after accidental drop",
    issueDescription: "Screen cracked in bottom-left corner. Touchscreen still functional. Display replacement needed.",
    priority: "Medium",
    status: "Approved",
    reportedBy: "Sana Iqbal",
    estimatedCompletion: daysFromNow(4),
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Sana Iqbal", timestamp: daysAgo(3) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(1) },
    ],
  },
  {
    id: "MR-023",
    assetTag: "AF-0460",
    assetName: "Ergonomic Chair (Finance)",
    assetCategory: "Furniture",
    department: "Finance",
    currentHolder: "Michael Chang",
    issueTitle: "Armrest padding torn – replacement needed",
    issueDescription: "Left armrest foam completely deteriorated. Fabric torn. Replacement part ordered.",
    priority: "Low",
    status: "Assigned",
    reportedBy: "Michael Chang",
    technicianId: "t2",
    estimatedCompletion: daysFromNow(3),
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Michael Chang", timestamp: daysAgo(5) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(3) },
      { id: "e3", event: "Technician Assigned", actor: "Admin", timestamp: daysAgo(1), note: "Meena Shetty assigned" },
    ],
  },
  {
    id: "MR-024",
    assetTag: "AF-0557",
    assetName: "UPS Battery Backup (Server Room)",
    assetCategory: "Electronics",
    department: "Operations",
    currentHolder: "IT Department",
    issueTitle: "UPS battery depleted – no backup power",
    issueDescription: "UPS ran flat. Backup battery shows 0% capacity. Replacement urgent before next power event.",
    priority: "Critical",
    status: "In Progress",
    reportedBy: "David Chen",
    technicianId: "t4",
    estimatedCompletion: daysFromNow(1),
    createdAt: daysAgo(2),
    updatedAt: daysAgo(0),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "David Chen", timestamp: daysAgo(2) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(2) },
      { id: "e3", event: "Technician Assigned", actor: "Admin", timestamp: daysAgo(1), note: "Priya Nair assigned" },
      { id: "e4", event: "Repair Started", actor: "Priya Nair", timestamp: daysAgo(0) },
    ],
  },
  {
    id: "MR-025",
    assetTag: "AF-0321",
    assetName: "Dell Latitude Laptop (Ops)",
    assetCategory: "Laptop",
    department: "Operations",
    currentHolder: "Tom Hardy",
    issueTitle: "Laptop won't boot – suspected SSD failure",
    issueDescription: "Laptop shows BIOS error on boot – 'NVMe device not found'. SSD likely failed.",
    priority: "High",
    status: "Resolved",
    reportedBy: "Tom Hardy",
    technicianId: "t1",
    repairCost: 210,
    resolutionNotes: "Faulty SSD replaced. Data recovered 98%. System re-imaged.",
    conditionAfterRepair: "Good",
    createdAt: daysAgo(22),
    updatedAt: daysAgo(6),
    timeline: [
      { id: "e1", event: "Request Raised", actor: "Tom Hardy", timestamp: daysAgo(22) },
      { id: "e2", event: "Approved", actor: "Admin", timestamp: daysAgo(21) },
      { id: "e3", event: "Technician Assigned", actor: "Admin", timestamp: daysAgo(19) },
      { id: "e4", event: "Repair Started", actor: "Ravi Varma", timestamp: daysAgo(12) },
      { id: "e5", event: "Parts Ordered", actor: "Ravi Varma", timestamp: daysAgo(11) },
      { id: "e6", event: "Repair Completed", actor: "Ravi Varma", timestamp: daysAgo(6) },
      { id: "e7", event: "Asset Returned", actor: "Admin", timestamp: daysAgo(6) },
    ],
  },
];
