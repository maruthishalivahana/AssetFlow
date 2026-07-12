import { z } from 'zod';
import { Role, UserStatus } from '@prisma/client';

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
