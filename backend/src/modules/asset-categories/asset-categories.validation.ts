import { z } from 'zod';
import { CategoryStatus } from '@prisma/client';

const customFieldConfigSchema = z.object({
  name: z.string().trim().min(1, 'Field name is required'),
  label: z.string().trim().min(1, 'Field label is required'),
  type: z.enum(['string', 'number', 'boolean', 'date']),
  required: z.boolean().default(false),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  code: z.string().trim().toUpperCase().min(1, 'Code is required'),
  description: z.string().trim().nullable().optional(),
  parentCategoryId: z.string().uuid().nullable().optional(),
  customFields: z.array(customFieldConfigSchema).optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').optional(),
  code: z.string().trim().toUpperCase().min(1, 'Code is required').optional(),
  description: z.string().trim().nullable().optional(),
  parentCategoryId: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(CategoryStatus).optional(),
  customFields: z.array(customFieldConfigSchema).optional(),
});

export const getCategoriesQuerySchema = z.object({
  page: z.preprocess((val) => (val ? Number(val) : 1), z.number().int().min(1)).optional(),
  limit: z
    .preprocess((val) => (val ? Number(val) : 10), z.number().int().min(1).max(100))
    .optional(),
  search: z.string().optional(),
  status: z.nativeEnum(CategoryStatus).optional(),
});
