import type { Request, Response } from 'express';

import { asyncHandler } from '@shared/middleware/asyncHandler';
import { successResponse } from '@shared/responses';

import { authService } from './auth.service';

const register = asyncHandler(async (req: Request, res: Response) => {
	const result = await authService.register(req.body);

	res.status(201).json(successResponse('Registration successful', result));
});

const login = asyncHandler(async (req: Request, res: Response) => {
	const result = await authService.login(req.body);

	res.status(200).json(successResponse('Login successful', result));
});

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
	const result = await authService.forgotPassword(req.body);

	res.status(200).json(
		successResponse('If the email exists, a reset link has been generated', result),
	);
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
	await authService.resetPassword(req.body);

	res.status(200).json(successResponse('Password reset successful'));
});

const me = asyncHandler(async (req: Request, res: Response) => {
	if (!req.user) {
		throw new Error('Unauthorized');
	}

	const user = await authService.currentUser(req.user.id);

	res.status(200).json(successResponse('Current user fetched successfully', { user }));
});

export const authController = {
	register,
	login,
	forgotPassword,
	resetPassword,
	me,
};