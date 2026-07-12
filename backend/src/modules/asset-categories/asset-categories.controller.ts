import type { Request, Response } from 'express';
import { asyncHandler } from '@shared/middleware/asyncHandler';
import { successResponse } from '@shared/responses';
import { assetCategoriesService } from './asset-categories.service';

const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const result = await assetCategoriesService.createCategory(req.body);
  res.status(201).json(successResponse('Asset category created successfully', result));
});

const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await assetCategoriesService.updateCategory(id as string, req.body);
  res.status(200).json(successResponse('Asset category updated successfully', result));
});

const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const result = await assetCategoriesService.getCategories(req.query);
  res.status(200).json(successResponse('Asset categories retrieved successfully', result));
});

const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await assetCategoriesService.getCategoryById(id as string);
  res.status(200).json(successResponse('Asset category retrieved successfully', result));
});

const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await assetCategoriesService.deleteCategory(id as string);
  res.status(200).json(successResponse('Asset category deleted successfully'));
});

const getCategoryTree = asyncHandler(async (_req: Request, res: Response) => {
  const result = await assetCategoriesService.getCategoryTree();
  res.status(200).json(successResponse('Asset category tree retrieved successfully', result));
});

export const assetCategoriesController = {
  createCategory,
  updateCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
  getCategoryTree,
};
