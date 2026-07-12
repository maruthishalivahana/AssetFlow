import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { assetsService } from './assets.service';
import { createAssetSchema, updateAssetSchema, listAssetsSchema } from './assets.validation';
import { ApiError } from '@shared/errors/ApiError';

const parseBody = <T>(schema: z.ZodType<T>, value: unknown): T => {
    const result = schema.safeParse(value);
    if (!result.success) {
        throw new ApiError(400, 'Validation failed', result.error.format());
    }
    return result.data;
};

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = parseBody(createAssetSchema, req.body);
        const files = (req.files as Express.Multer.File[] | undefined) ?? undefined;
        const userId = req.user?.id;

        const asset = await assetsService.createAsset(body, files, userId);

        res.status(201).json({ success: true, data: asset });
    } catch (err) {
        next(err);
    }
};

const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = parseBody(listAssetsSchema, req.query);
        const data = await assetsService.getAssets(query as any);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const asset = await assetsService.getAssetById(id);
        res.json({ success: true, data: asset });
    } catch (err) {
        next(err);
    }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const body = parseBody(updateAssetSchema, req.body);
        const files = (req.files as Express.Multer.File[] | undefined) ?? undefined;
        const userId = req.user?.id;

        const updated = await assetsService.updateAsset(id, body as any, files, userId);
        res.json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        const result = await assetsService.softDeleteAsset(id);
        res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

export const assetsController = {
    create,
    list,
    getOne,
    update,
    remove,
};
