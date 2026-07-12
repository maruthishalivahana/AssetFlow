export type DepartmentStatus = "Active" | "Inactive";

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  headAvatar?: string;
  parentDept: string | null;
  status: DepartmentStatus;
  employeesCount: number;
  assetsCount: number;
  createdDate: string;
  description?: string;
}

export type CategoryStatus = "Active" | "Inactive";

export interface AssetCategory {
  id: string;
  name: string;
  description: string;
  warrantyPeriod: string;
  maintenanceInterval: string;
  assetsCount: number;
  status: CategoryStatus;
  createdDate: string;
}

export type EmployeeRole = "Employee" | "Department Head" | "Asset Manager" | "Administrator";
export type EmployeeStatus = "Active" | "Inactive" | "Pending";

export interface Employee {
  id: string;
  fullName: string;
  employeeId: string;
  email: string;
  phone: string;
  department: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  joiningDate: string;
  assetsAssigned: number;
  avatarSrc?: string;
  avatarInitials: string;
}

export const mockDepartments: Department[] = [
  {
    id: "d1",
    name: "Engineering",
    code: "ENG-01",
    headName: "Aditi Rao",
    headAvatar: "https://i.pravatar.cc/150?u=aditi",
    parentDept: null,
    status: "Active",
    employeesCount: 42,
    assetsCount: 156,
    createdDate: "2024-01-15",
    description: "Core software engineering and development team.",
  },
  {
    id: "d2",
    name: "Facilities",
    code: "FAC-01",
    headName: "Rohan Mehta",
    headAvatar: "https://i.pravatar.cc/150?u=rohan",
    parentDept: null,
    status: "Active",
    employeesCount: 12,
    assetsCount: 304,
    createdDate: "2023-11-05",
    description: "Building management and facility operations.",
  },
  {
    id: "d3",
    name: "Field ops (east)",
    code: "FOE-01",
    headName: "Sana Iqbal",
    headAvatar: "https://i.pravatar.cc/150?u=sana",
    parentDept: "Field Ops",
    status: "Inactive",
    employeesCount: 8,
    assetsCount: 45,
    createdDate: "2024-03-22",
    description: "Eastern region field operations.",
  },
  {
    id: "d4",
    name: "Field ops (west)",
    code: "FOW-01",
    headName: "Sana Iqbal",
    headAvatar: "https://i.pravatar.cc/150?u=sana",
    parentDept: "Field Ops",
    status: "Inactive",
    employeesCount: 11,
    assetsCount: 62,
    createdDate: "2024-03-22",
    description: "Western region field operations.",
  },
  {
    id: "d5",
    name: "IT Support",
    code: "ITS-01",
    headName: "Michael Chang",
    headAvatar: "https://i.pravatar.cc/150?u=michael",
    parentDept: "Engineering",
    status: "Active",
    employeesCount: 15,
    assetsCount: 89,
    createdDate: "2023-08-10",
  },
];

export const mockCategories: AssetCategory[] = [
  {
    id: "c1",
    name: "Electronics",
    description: "Laptops, monitors, and peripherals.",
    warrantyPeriod: "3 Years",
    maintenanceInterval: "12 Months",
    assetsCount: 450,
    status: "Active",
    createdDate: "2023-05-12",
  },
  {
    id: "c2",
    name: "Furniture",
    description: "Desks, chairs, and office decor.",
    warrantyPeriod: "5 Years",
    maintenanceInterval: "24 Months",
    assetsCount: 230,
    status: "Active",
    createdDate: "2023-05-15",
  },
  {
    id: "c3",
    name: "Vehicles",
    description: "Company cars and delivery vans.",
    warrantyPeriod: "3 Years",
    maintenanceInterval: "6 Months",
    assetsCount: 15,
    status: "Active",
    createdDate: "2023-06-01",
  },
  {
    id: "c4",
    name: "Machinery",
    description: "Heavy industrial equipment.",
    warrantyPeriod: "2 Years",
    maintenanceInterval: "3 Months",
    assetsCount: 8,
    status: "Inactive",
    createdDate: "2023-08-20",
  },
];

export const mockEmployees: Employee[] = [
  {
    id: "e1",
    fullName: "Aditi Rao",
    employeeId: "EMP-001",
    email: "aditi.rao@assetflow.com",
    phone: "+1 (555) 019-2837",
    department: "Engineering",
    role: "Department Head",
    status: "Active",
    joiningDate: "2022-01-10",
    assetsAssigned: 4,
    avatarSrc: "https://i.pravatar.cc/150?u=aditi",
    avatarInitials: "AR",
  },
  {
    id: "e2",
    fullName: "Rohan Mehta",
    employeeId: "EMP-045",
    email: "rohan.mehta@assetflow.com",
    phone: "+1 (555) 928-1736",
    department: "Facilities",
    role: "Department Head",
    status: "Active",
    joiningDate: "2023-03-15",
    assetsAssigned: 2,
    avatarSrc: "https://i.pravatar.cc/150?u=rohan",
    avatarInitials: "RM",
  },
  {
    id: "e3",
    fullName: "Sana Iqbal",
    employeeId: "EMP-102",
    email: "sana.iqbal@assetflow.com",
    phone: "+1 (555) 736-2819",
    department: "Field Ops",
    role: "Asset Manager",
    status: "Inactive",
    joiningDate: "2023-11-20",
    assetsAssigned: 0,
    avatarSrc: "https://i.pravatar.cc/150?u=sana",
    avatarInitials: "SI",
  },
  {
    id: "e4",
    fullName: "David Chen",
    employeeId: "EMP-205",
    email: "david.chen@assetflow.com",
    phone: "+1 (555) 482-9102",
    department: "Engineering",
    role: "Employee",
    status: "Active",
    joiningDate: "2024-02-01",
    assetsAssigned: 3,
    avatarInitials: "DC",
  },
  {
    id: "e5",
    fullName: "Sarah Jenkins",
    employeeId: "EMP-218",
    email: "sarah.jenkins@assetflow.com",
    phone: "+1 (555) 839-2011",
    department: "HR",
    role: "Employee",
    status: "Pending",
    joiningDate: "2024-07-01",
    assetsAssigned: 1,
    avatarInitials: "SJ",
  },
];
