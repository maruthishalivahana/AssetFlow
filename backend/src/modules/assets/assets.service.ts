import { prisma } from '@config/prisma';
import { ApiError } from '@shared/errors/ApiError';
import type { CreateAssetInput, ListAssetsInput, UpdateAssetInput } from './assets.validation';

const formatAssetTag = (n: number) => `AF-${String(n).padStart(4, '0')}`;

const generateNextAssetTag = async (): Promise<string> => {
    // Simple sequential generator using count — note: small race-condition risk under heavy concurrency
    const count = await prisma.asset.count();
    let candidate = formatAssetTag(count + 1);

    // if already exists (rare), loop until unique
    // limit attempts to avoid infinite loop
    let attempts = 0;
    while (attempts < 5) {
        const existing = await prisma.asset.findUnique({ where: { assetTag: candidate } });
        if (!existing) return candidate;
        attempts += 1;
        candidate = formatAssetTag(count + 1 + attempts);
    }

    throw new ApiError(500, 'Unable to generate unique asset tag');
};

const createAsset = async (payload: CreateAssetInput, files: Express.Multer.File[] | undefined, userId?: string) => {
    if (!payload.name) throw new ApiError(400, 'Asset name is required');
    // ensure category and department exist
    const category = await prisma.assetCategory.findUnique({ where: { id: payload.assetCategoryId } });
    if (!category) throw new ApiError(400, 'Asset category not found');

    const department = await prisma.department.findUnique({ where: { id: payload.departmentId } });
    if (!department) throw new ApiError(400, 'Department not found');

    // serial number uniqueness
    if (payload.serialNumber) {
        const existingSerial = await prisma.asset.findUnique({ where: { serialNumber: payload.serialNumber } });
        if (existingSerial) throw new ApiError(409, 'Serial number already exists');
    }

    const assetTag = await generateNextAssetTag();

    const asset = await prisma.asset.create({
        data: {
            name: payload.name,
            description: payload.description,
            serialNumber: payload.serialNumber,
            assetTag,
            assetCategoryId: payload.assetCategoryId,
            departmentId: payload.departmentId,
            purchaseDate: payload.purchaseDate ? new Date(payload.purchaseDate) : undefined,
            purchaseCost: payload.purchaseCost ?? undefined,
            isBookable: payload.isBookable ?? false,
            condition: payload.condition ?? 'NEW',
            createdById: userId,
        },
    });

    if (files && files.length > 0) {
        const fileRecords = files.map((f) => ({
            assetId: asset.id,
            fileName: f.originalname,
            filePath: f.filename ? f.filename : f.path,
            mimeType: f.mimetype,
            fileSize: f.size,
            uploadedByUserId: userId,
        }));

        await prisma.assetFile.createMany({ data: fileRecords });
    }

    return asset;
};

const buildListWhere = (query: ListAssetsInput) => {
    const where: any = { deletedAt: null };

    if (query.q) {
        const q = query.q.trim();
        where.OR = [
            { assetTag: { contains: q, mode: 'insensitive' } },
            { serialNumber: { contains: q, mode: 'insensitive' } },
            { name: { contains: q, mode: 'insensitive' } },
        ];
    }

    if (query.category) where.assetCategoryId = query.category;
    if (query.status) where.status = query.status;
    if (query.department) where.departmentId = query.department;
    if (typeof query.isBookable === 'boolean') where.isBookable = query.isBookable;
    if (query.condition) where.condition = query.condition;

    return where;
};

const getAssets = async (query: ListAssetsInput) => {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = buildListWhere(query);

    const orderBy: any = {};
    if (query.sort) {
        switch (query.sort) {
            case 'oldest':
                orderBy.createdAt = 'asc';
                break;
            case 'name':
                orderBy.name = 'asc';
                break;
            default:
                orderBy.createdAt = 'desc';
        }
    } else {
        orderBy.createdAt = 'desc';
    }

    const [items, total] = await Promise.all([
        prisma.asset.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            include: {
                assetCategory: { select: { id: true, name: true, code: true } },
                department: { select: { id: true, name: true, code: true } },
                files: { select: { id: true, fileName: true, filePath: true, mimeType: true } },
            },
        }),
        prisma.asset.count({ where }),
    ]);

    return {
        items,
        total,
        page,
        limit,
    };
};

const getAssetById = async (id: string) => {
    const asset = await prisma.asset.findUnique({
        where: { id },
        include: {
            assetCategory: true,
            department: true,
            files: true,
            allocations: { orderBy: { allocatedAt: 'desc' } },
            maintenanceRequests: { orderBy: { requestedAt: 'desc' } },
        },
    });

    if (!asset || asset.deletedAt) throw new ApiError(404, 'Asset not found');

    return asset;
};

const updateAsset = async (id: string, payload: UpdateAssetInput, files: Express.Multer.File[] | undefined, userId?: string) => {
    const existing = await prisma.asset.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) throw new ApiError(404, 'Asset not found');

    if (payload.serialNumber && payload.serialNumber !== existing.serialNumber) {
        const dup = await prisma.asset.findUnique({ where: { serialNumber: payload.serialNumber } });
        if (dup) throw new ApiError(409, 'Serial number already exists');
    }

    const data: any = { ...payload };
    if (payload.purchaseDate) data.purchaseDate = new Date(payload.purchaseDate as any);

    const updated = await prisma.asset.update({ where: { id }, data });

    if (files && files.length > 0) {
        const fileRecords = files.map((f) => ({
            assetId: updated.id,
            fileName: f.originalname,
            filePath: f.filename ? f.filename : f.path,
            mimeType: f.mimetype,
            fileSize: f.size,
            uploadedByUserId: userId,
        }));

        await prisma.assetFile.createMany({ data: fileRecords });
    }

    return updated;
};

const softDeleteAsset = async (id: string) => {
    const existing = await prisma.asset.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) throw new ApiError(404, 'Asset not found');

    await prisma.asset.update({ where: { id }, data: { deletedAt: new Date() } });

    return { success: true };
};

export const assetsService = {
    createAsset,
    getAssets,
    getAssetById,
    updateAsset,
    softDeleteAsset,
};
