import type { Role } from '@prisma/client';

export type AuthLoginInput = {
	email: string;
	password: string;
};

export type AuthRegisterInput = {
	fullName: string;
	email: string;
	password: string;
};

export type ForgotPasswordInput = {
	email: string;
};

export type ResetPasswordInput = {
	token: string;
	password: string;
};

export type AuthUserDto = {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	phone: string | null;
	employeeCode: string | null;
	jobTitle: string | null;
	role: Role;
	status: string;
	department: {
		id: string;
		name: string;
		code: string;
	} | null;
	createdAt: Date;
	updatedAt: Date;
};

export type AuthResponseDto = {
	user: AuthUserDto;
	token: string;
};

export type ForgotPasswordResponseDto = {
	resetLink?: string;
};