import { z } from 'zod';

const passwordSchema = z
	.string()
	.min(8, 'Password must be at least 8 characters long')
	.max(100, 'Password must be at most 100 characters long');

export const registerSchema = z.object({
	fullName: z.string().trim().min(3, 'Full name is required').max(200),
	email: z.string().trim().email('Valid email is required').max(255),
	password: passwordSchema,
});

export const loginSchema = z.object({
	email: z.string().trim().email('Valid email is required').max(255),
	password: z.string().min(1, 'Password is required'),
});