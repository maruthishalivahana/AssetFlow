import type { Request, Response } from 'express';
import { asyncHandler } from '@shared/middleware/asyncHandler';
import { successResponse } from '@shared/responses';
import { departmentsService } from './departments.service';

const createDepartment = asyncHandler(async (req: Request, res: Response) => {
  const result = await departmentsService.createDepartment(req.body);
  res.status(201).json(successResponse('Department created successfully', result));
});

const updateDepartment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await departmentsService.updateDepartment(id as string, req.body);
  res.status(200).json(successResponse('Department updated successfully', result));
});

const getDepartments = asyncHandler(async (req: Request, res: Response) => {
  const result = await departmentsService.getDepartments(req.query);
  res.status(200).json(successResponse('Departments retrieved successfully', result));
});

const getDepartmentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await departmentsService.getDepartmentById(id as string);
  res.status(200).json(successResponse('Department retrieved successfully', result));
});

const deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await departmentsService.deleteDepartment(id as string);
  res.status(200).json(successResponse('Department deleted successfully'));
});

const getDepartmentTree = asyncHandler(async (_req: Request, res: Response) => {
  const result = await departmentsService.getDepartmentTree();
  res.status(200).json(successResponse('Department tree retrieved successfully', result));
});

export const departmentsController = {
  createDepartment,
  updateDepartment,
  getDepartments,
  getDepartmentById,
  deleteDepartment,
  getDepartmentTree,
};
