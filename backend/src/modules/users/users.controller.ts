import type { Request, Response } from 'express';
import { asyncHandler } from '@shared/middleware/asyncHandler';
import { successResponse } from '@shared/responses';
import { usersService } from './users.service';

const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  const result = await usersService.updateRole(id as string, role);

  res.status(200).json(successResponse('User role updated successfully', result));
});

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await usersService.getUsers(req.query);

  res.status(200).json(successResponse('Users retrieved successfully', result));
});

export const usersController = {
  updateRole,
  getUsers,
};
