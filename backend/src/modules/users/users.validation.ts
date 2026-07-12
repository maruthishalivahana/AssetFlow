import { z } from 'zod';
import { Role, UserStatus } from '@prisma/client';

export const createEmployeeSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  phone: z.string().trim().nullable().optional(),
  employeeCode: z.string().trim().min(1, 'Employee code is required').nullable().optional(),
  jobTitle: z.string().trim().nullable().optional(),
  departmentId: z.string().uuid().nullable().optional(),
  role: z.nativeEnum(Role).optional(),
});

export const updateEmployeeSchema = z.object({
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().nullable().optional(),
  employeeCode: z.string().trim().nullable().optional(),
  jobTitle: z.string().trim().nullable().optional(),
  departmentId: z.string().uuid().nullable().optional(),
  role: z.nativeEnum(Role).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum(['EMPLOYEE', 'ASSET_MANAGER', 'DEPARTMENT_HEAD']),
});

export const getUsersQuerySchema = z.object({
  page: z.preprocess((val) => (val ? Number(val) : 1), z.number().int().min(1)).optional(),
  limit: z
    .preprocess((val) => (val ? Number(val) : 10), z.number().int().min(1).max(100))
    .optional(),
  search: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  departmentId: z.string().uuid().optional(),
});
