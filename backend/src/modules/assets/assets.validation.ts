import { z } from 'zod';

export const createAssetSchema = z.object({
    name: z.string().min(1),
    assetCategoryId: z.string().uuid(),
    departmentId: z.string().uuid(),
    serialNumber: z.string().optional(),
    description: z.string().optional(),
    purchaseDate: z.string().optional(),
    purchaseCost: z.number().optional(),
    isBookable: z.boolean().optional(),
    condition: z.enum(['NEW', 'GOOD', 'FAIR', 'DAMAGED', 'SCRAPPED']).optional(),
});

export const updateAssetSchema = createAssetSchema.partial();

export const listAssetsSchema = z.object({
    q: z.string().optional(),
    category: z.string().optional(),
    status: z.string().optional(),
    department: z.string().optional(),
    location: z.string().optional(),
    condition: z.string().optional(),
    isBookable: z.preprocess((v) => {
        if (v === 'true') return true;
        if (v === 'false') return false;
        return undefined;
    }, z.boolean().optional()),
    page: z.preprocess((v) => Number(v), z.number().int().positive().optional()),
    limit: z.preprocess((v) => Number(v), z.number().int().positive().optional()),
    sort: z.string().optional(),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;
export type ListAssetsInput = z.infer<typeof listAssetsSchema>;
