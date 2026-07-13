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

// Types
import { Department, AssetCategory } from "@/src/types/organization";

// Redux
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  fetchDepartments, createDepartment, updateDepartment, deleteDepartment,
  fetchCategories, createCategory, updateCategory, deleteCategory
} from "@/src/store/slices/organizationSlice";

import { fetchUsers, createEmployee, updateEmployee, deleteEmployee } from "@/src/store/slices/usersSlice";

// Mock Data
import { Employee } from "./mockData";
import { EmployeeFormDialog } from "./EmployeeFormDialog";
import { AuthUser } from "@/src/types/auth";

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

  // Redux State
  const dispatch = useAppDispatch();
  const { departments, categories, isLoading } = useAppSelector(state => state.organization);
  const { items: employees, loading: employeesLoading } = useAppSelector(state => state.users);

  // State for Departments
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isDeptAddEditOpen, setIsDeptAddEditOpen] = useState(false);
  const [isDeptViewOpen, setIsDeptViewOpen] = useState(false);

  // State for Categories
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null);
  const [isCategoryAddEditOpen, setIsCategoryAddEditOpen] = useState(false);
  const [isCategoryViewOpen, setIsCategoryViewOpen] = useState(false);

  // State for Employees
  const [selectedEmployee, setSelectedEmployee] = useState<AuthUser | null>(null);
  const [isEmployeeAddEditOpen, setIsEmployeeAddEditOpen] = useState(false);
  const [isEmployeeViewOpen, setIsEmployeeViewOpen] = useState(false);
  const [isRolePromotionOpen, setIsRolePromotionOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchCategories());
    dispatch(fetchUsers());
  }, [dispatch]);

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
    }
  };

  // Derived Data for Departments
  const filteredDepartments = departments.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesParent = deptFilter === "all" || d.parentDepartment?.name === deptFilter;
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
    const fullName = `${e.firstName} ${e.lastName}`.trim();
    const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || (e.status || "").toLowerCase() === statusFilter.toLowerCase();
    const matchesRole = roleFilter === "all" || e.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Handlers for Departments
  const handleSaveDepartment = async (data: any) => {
    if (selectedDept) {
      await dispatch(updateDepartment({ id: selectedDept.id, data })).unwrap();
    } else {
      await dispatch(createDepartment(data)).unwrap();
    }

    await dispatch(fetchDepartments());
    setIsDeptAddEditOpen(false);
    setSelectedDept(null);
  };

  const handleDeleteDepartment = async (dept: Department) => {
    if (confirm("Are you sure you want to delete this department?")) {
      await dispatch(deleteDepartment(dept.id)).unwrap();
      await dispatch(fetchDepartments());
    }
  };

  // Handlers for Categories
  const handleSaveCategory = async (data: any) => {
    if (selectedCategory) {
      await dispatch(updateCategory({ id: selectedCategory.id, data })).unwrap();
    } else {
      await dispatch(createCategory(data)).unwrap();
    }
    await dispatch(fetchCategories());
    setIsCategoryAddEditOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = async (cat: AssetCategory) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await dispatch(deleteCategory(cat.id)).unwrap();
      await dispatch(fetchCategories());
    }
  };

  // Handlers for Employees
  const handleSaveEmployee = async (data: any) => {
    if (selectedEmployee) {
      await dispatch(updateEmployee({ id: selectedEmployee.id, payload: data })).unwrap();
    } else {
      await dispatch(createEmployee(data)).unwrap();
    }
    await dispatch(fetchUsers());
    setIsEmployeeAddEditOpen(false);
    setSelectedEmployee(null);
  };

  const handleEditEmployee = (employee: AuthUser) => {
    setSelectedEmployee(employee);
    setIsEmployeeAddEditOpen(true);
  };

  const handlePromoteEmployee = async (employeeId: string, newRole: string) => {
    await dispatch(updateEmployee({ id: employeeId, payload: { role: newRole as any } })).unwrap();
    await dispatch(fetchUsers());
    setIsRolePromotionOpen(false);
  };

  const parentDeptOptions = Array.from(new Set(departments.map(d => d.parentDepartment?.name).filter(Boolean))).map(d => ({
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
      <OrganizationHeader activeTab={activeTab} onAddClick={activeTab !== "employees" ? handleAddClick : undefined} />

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
                    onEdit={handleEditEmployee}
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
        departments={departments}
        users={employees}
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
        categories={categories}
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
      <EmployeeFormDialog
        open={isEmployeeAddEditOpen}
        onOpenChange={setIsEmployeeAddEditOpen}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
        departments={departments}
      />
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
