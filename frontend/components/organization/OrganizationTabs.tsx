"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

import { OrganizationHeader } from "./OrganizationHeader";
import { OrganizationToolbar } from "./OrganizationToolbar";

// Tab 1 Components
import { DepartmentTable } from "./DepartmentTable";
import { DepartmentDialog } from "./DepartmentDialog";
import { DepartmentDetailsDialog } from "./DepartmentDetailsDialog";

// Tab 2 Components
import { CategoryTable } from "./CategoryTable";
import { CategoryDialog } from "./CategoryDialog";
import { CategoryDetailsDialog } from "./CategoryDetailsDialog";

// Tab 3 Components
import { EmployeeTable } from "./EmployeeTable";
import { EmployeeDialog } from "./EmployeeDialog";
import { RolePromotionDialog } from "./RolePromotionDialog";

// Mock Data
import {
  mockDepartments,
  mockCategories,
  mockEmployees,
  Department,
  AssetCategory,
  Employee,
} from "./mockData";

export function OrganizationTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const defaultTab = tabParam && ["departments", "categories", "employees"].includes(tabParam)
    ? tabParam
    : "departments";

  const [activeTab, setActiveTab] = useState(defaultTab);

  // Global UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Tab Specific Filters
  const [deptFilter, setDeptFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // State for Departments
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isDeptAddEditOpen, setIsDeptAddEditOpen] = useState(false);
  const [isDeptViewOpen, setIsDeptViewOpen] = useState(false);

  // State for Categories
  const [categories, setCategories] = useState<AssetCategory[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null);
  const [isCategoryAddEditOpen, setIsCategoryAddEditOpen] = useState(false);
  const [isCategoryViewOpen, setIsCategoryViewOpen] = useState(false);

  // State for Employees
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEmployeeViewOpen, setIsEmployeeViewOpen] = useState(false);
  const [isRolePromotionOpen, setIsRolePromotionOpen] = useState(false);

  useEffect(() => {
    if (tabParam && ["departments", "categories", "employees"].includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
      // Reset filters when switching tabs
      setSearchQuery("");
      setStatusFilter("all");
    }
  }, [tabParam, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery("");
    setStatusFilter("all");
    router.push(`?tab=${value}`, { scroll: false });
  };

  const handleAddClick = () => {
    if (activeTab === "departments") {
      setSelectedDept(null);
      setIsDeptAddEditOpen(true);
    } else if (activeTab === "categories") {
      setSelectedCategory(null);
      setIsCategoryAddEditOpen(true);
    } else if (activeTab === "employees") {
      // Typically opens an Add Employee dialog, not implemented fully in request but we can stub it or leave it as a no-op
      console.log("Add employee clicked");
    }
  };

  // Derived Data for Departments
  const filteredDepartments = departments.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesParent = deptFilter === "all" || d.parentDept === deptFilter;
    return matchesSearch && matchesStatus && matchesParent;
  });

  // Derived Data for Categories
  const filteredCategories = categories.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Derived Data for Employees
  const filteredEmployees = employees.filter((e) => {
    const matchesSearch = e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesRole = roleFilter === "all" || e.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Handlers for Departments
  const handleSaveDepartment = (data: any) => {
    if (selectedDept) {
      // Edit
      setDepartments(departments.map(d => d.id === selectedDept.id ? { ...d, ...data } : d));
    } else {
      // Add
      const newDept: Department = {
        ...data,
        id: `d${Date.now()}`,
        headAvatar: "https://i.pravatar.cc/150",
        employeesCount: 0,
        assetsCount: 0,
        createdDate: new Date().toISOString(),
      };
      setDepartments([newDept, ...departments]);
    }
  };
  
  const handleDeleteDepartment = (dept: Department) => {
    setDepartments(departments.filter(d => d.id !== dept.id));
  };

  // Handlers for Categories
  const handleSaveCategory = (data: any) => {
    if (selectedCategory) {
      // Edit
      setCategories(categories.map(c => c.id === selectedCategory.id ? { ...c, ...data } : c));
    } else {
      // Add
      const newCat: AssetCategory = {
        ...data,
        id: `c${Date.now()}`,
        assetsCount: 0,
        createdDate: new Date().toISOString(),
      };
      setCategories([newCat, ...categories]);
    }
  };

  const handleDeleteCategory = (cat: AssetCategory) => {
    setCategories(categories.filter(c => c.id !== cat.id));
  };

  // Handlers for Employees
  const handlePromoteEmployee = (employeeId: string, newRole: string) => {
    setEmployees(employees.map(e => e.id === employeeId ? { ...e, role: newRole as any } : e));
  };

  const parentDeptOptions = Array.from(new Set(departments.map(d => d.parentDept).filter(Boolean))).map(d => ({
    label: d as string,
    value: d as string,
  }));

  const roleOptions = [
    { label: "Employee", value: "Employee" },
    { label: "Asset Manager", value: "Asset Manager" },
    { label: "Department Head", value: "Department Head" },
    { label: "Administrator", value: "Administrator" },
  ];

  return (
    <div className="w-full h-full max-w-7xl mx-auto flex flex-col pt-6 pb-12 px-4 sm:px-6 lg:px-8">
      <OrganizationHeader activeTab={activeTab} onAddClick={handleAddClick} />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mt-2">
        <div className="border-b border-border mb-6">
          <TabsList className="bg-transparent h-12 p-0 space-x-6 overflow-x-auto w-full justify-start overflow-y-hidden">
            <TabsTrigger 
              value="departments" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:text-emerald-500 text-slate-400 px-1 py-3"
            >
              Departments
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:text-emerald-500 text-slate-400 px-1 py-3"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger 
              value="employees" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:text-emerald-500 text-slate-400 px-1 py-3"
            >
              Employees
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "departments" && (
                <TabsContent value="departments" className="mt-0 outline-none">
                  <OrganizationToolbar 
                    searchPlaceholder="Search departments..."
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    extraFilterLabel="Parent Dept"
                    extraFilterValue={deptFilter}
                    onExtraFilterChange={setDeptFilter}
                    extraFilterOptions={parentDeptOptions}
                  />
                  <DepartmentTable 
                    departments={filteredDepartments} 
                    onView={(dept) => { setSelectedDept(dept); setIsDeptViewOpen(true); }}
                    onEdit={(dept) => { setSelectedDept(dept); setIsDeptAddEditOpen(true); }}
                    onDelete={handleDeleteDepartment}
                  />
                </TabsContent>
              )}

              {activeTab === "categories" && (
                <TabsContent value="categories" className="mt-0 outline-none">
                  <OrganizationToolbar 
                    searchPlaceholder="Search categories..."
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                  />
                  <CategoryTable 
                    categories={filteredCategories}
                    onView={(cat) => { setSelectedCategory(cat); setIsCategoryViewOpen(true); }}
                    onEdit={(cat) => { setSelectedCategory(cat); setIsCategoryAddEditOpen(true); }}
                    onDelete={handleDeleteCategory}
                  />
                </TabsContent>
              )}

              {activeTab === "employees" && (
                <TabsContent value="employees" className="mt-0 outline-none">
                  <OrganizationToolbar 
                    searchPlaceholder="Search employees by name or email..."
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    extraFilterLabel="Role"
                    extraFilterValue={roleFilter}
                    onExtraFilterChange={setRoleFilter}
                    extraFilterOptions={roleOptions}
                  />
                  <EmployeeTable 
                    employees={filteredEmployees}
                    onView={(emp) => { setSelectedEmployee(emp); setIsEmployeeViewOpen(true); }}
                    onPromote={(emp) => { setSelectedEmployee(emp); setIsRolePromotionOpen(true); }}
                  />
                </TabsContent>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>

      {/* Department Modals */}
      <DepartmentDialog 
        open={isDeptAddEditOpen} 
        onOpenChange={setIsDeptAddEditOpen} 
        department={selectedDept}
        onSave={handleSaveDepartment}
      />
      <DepartmentDetailsDialog
        open={isDeptViewOpen}
        onOpenChange={setIsDeptViewOpen}
        department={selectedDept}
      />

      {/* Category Modals */}
      <CategoryDialog
        open={isCategoryAddEditOpen}
        onOpenChange={setIsCategoryAddEditOpen}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />
      <CategoryDetailsDialog
        open={isCategoryViewOpen}
        onOpenChange={setIsCategoryViewOpen}
        category={selectedCategory}
      />

      {/* Employee Modals */}
      <EmployeeDialog
        open={isEmployeeViewOpen}
        onOpenChange={setIsEmployeeViewOpen}
        employee={selectedEmployee}
      />
      <RolePromotionDialog
        open={isRolePromotionOpen}
        onOpenChange={setIsRolePromotionOpen}
        employee={selectedEmployee}
        onSave={handlePromoteEmployee}
      />
    </div>
  );
}
