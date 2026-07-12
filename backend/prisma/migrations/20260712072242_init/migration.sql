-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."DepartmentStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."CategoryStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "public"."AssetStatus" AS ENUM ('AVAILABLE', 'ALLOCATED', 'RESERVED', 'UNDER_MAINTENANCE', 'LOST', 'RETIRED', 'DISPOSED');

-- CreateEnum
CREATE TYPE "public"."AssetCondition" AS ENUM ('NEW', 'GOOD', 'FAIR', 'DAMAGED', 'SCRAPPED');

-- CreateEnum
CREATE TYPE "public"."AllocationStatus" AS ENUM ('ACTIVE', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ReturnCondition" AS ENUM ('GOOD', 'DAMAGED', 'LOST');

-- CreateEnum
CREATE TYPE "public"."TransferStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."MaintenanceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'TECHNICIAN_ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('INFO', 'ALERT', 'REMINDER', 'APPROVAL');

-- CreateEnum
CREATE TYPE "public"."EntityType" AS ENUM ('ASSET', 'BOOKING', 'TRANSFER', 'MAINTENANCE', 'AUDIT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "public"."Severity" AS ENUM ('INFO', 'WARNING', 'ERROR');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "employee_code" TEXT,
    "job_title" TEXT,
    "role" "public"."Role" NOT NULL,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "department_id" UUID,
    "created_by_id" UUID,
    "updated_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."departments" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "public"."DepartmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "parent_department_id" UUID,
    "head_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."asset_categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."CategoryStatus" NOT NULL DEFAULT 'ACTIVE',
    "parent_category_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "asset_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."assets" (
    "id" UUID NOT NULL,
    "asset_tag" TEXT NOT NULL,
    "serial_number" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "department_id" UUID NOT NULL,
    "asset_category_id" UUID NOT NULL,
    "status" "public"."AssetStatus" NOT NULL DEFAULT 'AVAILABLE',
    "condition" "public"."AssetCondition" NOT NULL DEFAULT 'NEW',
    "is_bookable" BOOLEAN NOT NULL DEFAULT false,
    "purchase_cost" DECIMAL(14,2),
    "purchase_date" TIMESTAMP(3),
    "warranty_end_at" TIMESTAMP(3),
    "metadata" JSONB,
    "created_by_id" UUID,
    "updated_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."asset_files" (
    "id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "uploaded_by_user_id" UUID,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "mime_type" TEXT,
    "file_size" INTEGER,
    "file_hash" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "asset_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."asset_allocations" (
    "id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "assigned_to_user_id" UUID NOT NULL,
    "allocated_by_user_id" UUID,
    "returned_by_user_id" UUID,
    "status" "public"."AllocationStatus" NOT NULL DEFAULT 'ACTIVE',
    "allocated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expected_return_at" TIMESTAMP(3),
    "returned_at" TIMESTAMP(3),
    "return_condition" "public"."ReturnCondition",
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."asset_transfer_requests" (
    "id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "requested_by_user_id" UUID NOT NULL,
    "approved_by_user_id" UUID,
    "completed_by_user_id" UUID,
    "from_department_id" UUID NOT NULL,
    "to_department_id" UUID NOT NULL,
    "status" "public"."TransferStatus" NOT NULL DEFAULT 'PENDING',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMP(3),
    "rejected_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "rejection_reason" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asset_transfer_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bookings" (
    "id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "requested_by_user_id" UUID NOT NULL,
    "approved_by_user_id" UUID,
    "title" TEXT NOT NULL,
    "purpose" TEXT,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "status" "public"."BookingStatus" NOT NULL DEFAULT 'PENDING',
    "approval_notes" TEXT,
    "approved_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."maintenance_requests" (
    "id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "requested_by_user_id" UUID NOT NULL,
    "approved_by_user_id" UUID,
    "technician_user_id" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "public"."MaintenanceStatus" NOT NULL DEFAULT 'PENDING',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMP(3),
    "technician_assigned_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "resolved_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "resolution_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "maintenance_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_cycles" (
    "id" UUID NOT NULL,
    "cycle_code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "department_id" UUID NOT NULL,
    "created_by_user_id" UUID NOT NULL,
    "scheduled_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "audit_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_items" (
    "id" UUID NOT NULL,
    "audit_cycle_id" UUID NOT NULL,
    "asset_id" UUID NOT NULL,
    "audited_by_user_id" UUID NOT NULL,
    "expected_asset_status" "public"."AssetStatus" NOT NULL,
    "observed_asset_status" "public"."AssetStatus" NOT NULL,
    "expected_condition" "public"."AssetCondition",
    "observed_condition" "public"."AssetCondition",
    "variance_notes" TEXT,
    "counted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "public"."NotificationType" NOT NULL DEFAULT 'INFO',
    "severity" "public"."Severity" NOT NULL DEFAULT 'INFO',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "entity_type" "public"."EntityType" NOT NULL,
    "entity_id" UUID,
    "metadata" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activity_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "entity_type" "public"."EntityType" NOT NULL,
    "entity_id" UUID,
    "action" TEXT NOT NULL,
    "severity" "public"."Severity" NOT NULL DEFAULT 'INFO',
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_employee_code_key" ON "public"."users"("employee_code");

-- CreateIndex
CREATE INDEX "users_department_id_idx" ON "public"."users"("department_id");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "public"."users"("status");

-- CreateIndex
CREATE INDEX "departments_parent_department_id_idx" ON "public"."departments"("parent_department_id");

-- CreateIndex
CREATE INDEX "departments_head_user_id_idx" ON "public"."departments"("head_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "departments_code_key" ON "public"."departments"("code");

-- CreateIndex
CREATE INDEX "asset_categories_parent_category_id_idx" ON "public"."asset_categories"("parent_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "asset_categories_code_key" ON "public"."asset_categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "assets_asset_tag_key" ON "public"."assets"("asset_tag");

-- CreateIndex
CREATE UNIQUE INDEX "assets_serial_number_key" ON "public"."assets"("serial_number");

-- CreateIndex
CREATE INDEX "assets_department_id_idx" ON "public"."assets"("department_id");

-- CreateIndex
CREATE INDEX "assets_asset_category_id_idx" ON "public"."assets"("asset_category_id");

-- CreateIndex
CREATE INDEX "assets_status_idx" ON "public"."assets"("status");

-- CreateIndex
CREATE INDEX "assets_condition_idx" ON "public"."assets"("condition");

-- CreateIndex
CREATE INDEX "asset_files_asset_id_idx" ON "public"."asset_files"("asset_id");

-- CreateIndex
CREATE INDEX "asset_files_uploaded_by_user_id_idx" ON "public"."asset_files"("uploaded_by_user_id");

-- CreateIndex
CREATE INDEX "asset_allocations_asset_id_idx" ON "public"."asset_allocations"("asset_id");

-- CreateIndex
CREATE INDEX "asset_allocations_assigned_to_user_id_idx" ON "public"."asset_allocations"("assigned_to_user_id");

-- CreateIndex
CREATE INDEX "asset_allocations_allocated_at_idx" ON "public"."asset_allocations"("allocated_at");

-- CreateIndex
CREATE INDEX "asset_allocations_status_idx" ON "public"."asset_allocations"("status");

-- CreateIndex
CREATE INDEX "asset_transfer_requests_asset_id_idx" ON "public"."asset_transfer_requests"("asset_id");

-- CreateIndex
CREATE INDEX "asset_transfer_requests_requested_by_user_id_idx" ON "public"."asset_transfer_requests"("requested_by_user_id");

-- CreateIndex
CREATE INDEX "asset_transfer_requests_status_idx" ON "public"."asset_transfer_requests"("status");

-- CreateIndex
CREATE INDEX "asset_transfer_requests_from_department_id_idx" ON "public"."asset_transfer_requests"("from_department_id");

-- CreateIndex
CREATE INDEX "asset_transfer_requests_to_department_id_idx" ON "public"."asset_transfer_requests"("to_department_id");

-- CreateIndex
CREATE INDEX "bookings_asset_id_idx" ON "public"."bookings"("asset_id");

-- CreateIndex
CREATE INDEX "bookings_requested_by_user_id_idx" ON "public"."bookings"("requested_by_user_id");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "public"."bookings"("status");

-- CreateIndex
CREATE INDEX "bookings_start_at_idx" ON "public"."bookings"("start_at");

-- CreateIndex
CREATE INDEX "bookings_end_at_idx" ON "public"."bookings"("end_at");

-- CreateIndex
CREATE INDEX "maintenance_requests_asset_id_idx" ON "public"."maintenance_requests"("asset_id");

-- CreateIndex
CREATE INDEX "maintenance_requests_requested_by_user_id_idx" ON "public"."maintenance_requests"("requested_by_user_id");

-- CreateIndex
CREATE INDEX "maintenance_requests_technician_user_id_idx" ON "public"."maintenance_requests"("technician_user_id");

-- CreateIndex
CREATE INDEX "maintenance_requests_status_idx" ON "public"."maintenance_requests"("status");

-- CreateIndex
CREATE INDEX "maintenance_requests_priority_idx" ON "public"."maintenance_requests"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "audit_cycles_cycle_code_key" ON "public"."audit_cycles"("cycle_code");

-- CreateIndex
CREATE INDEX "audit_cycles_department_id_idx" ON "public"."audit_cycles"("department_id");

-- CreateIndex
CREATE INDEX "audit_cycles_status_idx" ON "public"."audit_cycles"("status");

-- CreateIndex
CREATE INDEX "audit_cycles_scheduled_at_idx" ON "public"."audit_cycles"("scheduled_at");

-- CreateIndex
CREATE INDEX "audit_items_audit_cycle_id_idx" ON "public"."audit_items"("audit_cycle_id");

-- CreateIndex
CREATE INDEX "audit_items_asset_id_idx" ON "public"."audit_items"("asset_id");

-- CreateIndex
CREATE INDEX "audit_items_audited_by_user_id_idx" ON "public"."audit_items"("audited_by_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "audit_items_audit_cycle_id_asset_id_key" ON "public"."audit_items"("audit_cycle_id", "asset_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "public"."notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "public"."notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "public"."notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_entity_type_entity_id_idx" ON "public"."notifications"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "activity_logs_user_id_idx" ON "public"."activity_logs"("user_id");

-- CreateIndex
CREATE INDEX "activity_logs_entity_type_entity_id_idx" ON "public"."activity_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "activity_logs_action_idx" ON "public"."activity_logs"("action");

-- CreateIndex
CREATE INDEX "activity_logs_created_at_idx" ON "public"."activity_logs"("created_at");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."departments" ADD CONSTRAINT "departments_parent_department_id_fkey" FOREIGN KEY ("parent_department_id") REFERENCES "public"."departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."departments" ADD CONSTRAINT "departments_head_user_id_fkey" FOREIGN KEY ("head_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_categories" ADD CONSTRAINT "asset_categories_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "public"."asset_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assets" ADD CONSTRAINT "assets_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assets" ADD CONSTRAINT "assets_asset_category_id_fkey" FOREIGN KEY ("asset_category_id") REFERENCES "public"."asset_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assets" ADD CONSTRAINT "assets_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assets" ADD CONSTRAINT "assets_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_files" ADD CONSTRAINT "asset_files_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_files" ADD CONSTRAINT "asset_files_uploaded_by_user_id_fkey" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_allocations" ADD CONSTRAINT "asset_allocations_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_allocations" ADD CONSTRAINT "asset_allocations_assigned_to_user_id_fkey" FOREIGN KEY ("assigned_to_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_allocations" ADD CONSTRAINT "asset_allocations_allocated_by_user_id_fkey" FOREIGN KEY ("allocated_by_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_allocations" ADD CONSTRAINT "asset_allocations_returned_by_user_id_fkey" FOREIGN KEY ("returned_by_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_transfer_requests" ADD CONSTRAINT "asset_transfer_requests_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_transfer_requests" ADD CONSTRAINT "asset_transfer_requests_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_transfer_requests" ADD CONSTRAINT "asset_transfer_requests_approved_by_user_id_fkey" FOREIGN KEY ("approved_by_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_transfer_requests" ADD CONSTRAINT "asset_transfer_requests_completed_by_user_id_fkey" FOREIGN KEY ("completed_by_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_transfer_requests" ADD CONSTRAINT "asset_transfer_requests_from_department_id_fkey" FOREIGN KEY ("from_department_id") REFERENCES "public"."departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asset_transfer_requests" ADD CONSTRAINT "asset_transfer_requests_to_department_id_fkey" FOREIGN KEY ("to_department_id") REFERENCES "public"."departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_approved_by_user_id_fkey" FOREIGN KEY ("approved_by_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance_requests" ADD CONSTRAINT "maintenance_requests_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance_requests" ADD CONSTRAINT "maintenance_requests_requested_by_user_id_fkey" FOREIGN KEY ("requested_by_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance_requests" ADD CONSTRAINT "maintenance_requests_approved_by_user_id_fkey" FOREIGN KEY ("approved_by_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."maintenance_requests" ADD CONSTRAINT "maintenance_requests_technician_user_id_fkey" FOREIGN KEY ("technician_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_cycles" ADD CONSTRAINT "audit_cycles_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_cycles" ADD CONSTRAINT "audit_cycles_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_items" ADD CONSTRAINT "audit_items_audit_cycle_id_fkey" FOREIGN KEY ("audit_cycle_id") REFERENCES "public"."audit_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_items" ADD CONSTRAINT "audit_items_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_items" ADD CONSTRAINT "audit_items_audited_by_user_id_fkey" FOREIGN KEY ("audited_by_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
