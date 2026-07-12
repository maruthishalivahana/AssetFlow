import { z } from 'zod';
import { DepartmentStatus } from '@prisma/client';

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  code: z.string().trim().toUpperCase().min(1, 'Code is required'),
  parentDepartmentId: z.string().uuid().nullable().optional(),
  headUserId: z.string().uuid().nullable().optional(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').optional(),
  code: z.string().trim().toUpperCase().min(1, 'Code is required').optional(),
  parentDepartmentId: z.string().uuid().nullable().optional(),
  headUserId: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(DepartmentStatus).optional(),
});

export const getDepartmentsQuerySchema = z.object({
  page: z.preprocess((val) => (val ? Number(val) : 1), z.number().int().min(1)).optional(),
  limit: z
    .preprocess((val) => (val ? Number(val) : 10), z.number().int().min(1).max(100))
    .optional(),
  search: z.string().optional(),
  status: z.nativeEnum(DepartmentStatus).optional(),
});
