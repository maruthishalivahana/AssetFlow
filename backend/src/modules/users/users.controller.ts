import type { Request, Response } from 'express';
import { asyncHandler } from '@shared/middleware/asyncHandler';
import { successResponse } from '@shared/responses';
import { usersService } from './users.service';

const createEmployee = asyncHandler(async (req: Request, res: Response) => {
  const result = await usersService.createEmployee(req.body);
  res.status(201).json(successResponse('Employee created successfully', result));
});

const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await usersService.updateEmployee(id as string, req.body);
  res.status(200).json(successResponse('Employee updated successfully', result));
});

const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  const result = await usersService.updateRole(id as string, role);
  res.status(200).json(successResponse('User role updated successfully', result));
});

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const currentRequestUser = req.user;
  if (!currentRequestUser) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const query = { ...req.query };
  if (currentRequestUser.role === 'DEPARTMENT_HEAD') {
    query.departmentId = currentRequestUser.departmentId || 'NONE';
  }

  const result = await usersService.getUsers(query);

  res.status(200).json(successResponse('Users retrieved successfully', result));
});

const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Authorization check (Task 15: Get Employee Details)
  // Admin & Asset Manager can view all
  // Department Head can view members of their own department
  // Employee can view self only
  const currentRequestUser = req.user;
  if (!currentRequestUser) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const result = await usersService.getUserById(id as string);

  const canAccess =
    currentRequestUser.role === 'ADMIN' ||
    currentRequestUser.role === 'ASSET_MANAGER' ||
    (currentRequestUser.role === 'DEPARTMENT_HEAD' &&
      result.departmentId === currentRequestUser.departmentId) ||
    (currentRequestUser.role === 'EMPLOYEE' && result.id === currentRequestUser.id);

  if (!canAccess) {
    res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
    return;
  }

  res.status(200).json(successResponse('User details retrieved successfully', result));
});

const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await usersService.deleteEmployee(id as string);
  res.status(200).json(successResponse('Employee deleted successfully'));
});

const getUsersDropdown = asyncHandler(async (_req: Request, res: Response) => {
  const result = await usersService.getUsersDropdown();
  res.status(200).json(successResponse('User dropdown retrieved successfully', result));
});

export const usersController = {
  createEmployee,
  updateEmployee,
  updateRole,
  getUsers,
  getUserById,
  deleteEmployee,
  getUsersDropdown,
};
