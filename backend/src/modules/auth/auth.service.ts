import { Role, type Prisma } from '@prisma/client';

import { prisma } from '@config/prisma';
import { ApiError } from '@shared/errors/ApiError';
import { comparePassword, hashPassword } from '@shared/utils/hash';
import { signToken } from '@shared/utils/token';

import type {
	AuthLoginInput,
	AuthRegisterInput,
	AuthResponseDto,
	AuthUserDto,
} from './auth.types';

const userSelect = {
	id: true,
	email: true,
	departmentId: true,
	firstName: true,
	lastName: true,
	phone: true,
	employeeCode: true,
	jobTitle: true,
	role: true,
	status: true,
	createdAt: true,
	updatedAt: true,
	department: {
		select: {
			id: true,
			name: true,
			code: true,
		},
	},
} satisfies Prisma.UserSelect;

type UserWithRelations = Prisma.UserGetPayload<{ select: typeof userSelect }>;

const splitFullName = (fullName: string): { firstName: string; lastName: string } => {
	const normalizedFullName = fullName.trim().replace(/\s+/g, ' ');
	const [firstName, ...remainingParts] = normalizedFullName.split(' ');

	return {
		firstName: firstName ?? '',
		lastName: remainingParts.join(' '),
	};
};

const buildAuthResponse = (user: UserWithRelations): AuthResponseDto => {
	const token = signToken({
		id: user.id,
		email: user.email,
		role: user.role,
		departmentId: user.departmentId,
	});

	return {
		user: mapUser(user),
		token,
	};
};

const mapUser = (user: UserWithRelations): AuthUserDto => ({
	id: user.id,
	email: user.email,
	firstName: user.firstName,
	lastName: user.lastName,
	phone: user.phone,
	employeeCode: user.employeeCode,
	jobTitle: user.jobTitle,
	role: user.role,
	status: user.status,
	department: user.department,
	createdAt: user.createdAt,
	updatedAt: user.updatedAt,
});

const getUserById = async (userId: string): Promise<UserWithRelations> => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: userSelect,
	});

	if (!user) {
		throw new ApiError(404, 'User not found');
	}

	return user;
};

const register = async (payload: AuthRegisterInput): Promise<AuthResponseDto> => {
	const { firstName, lastName } = splitFullName(payload.fullName);

	if (!firstName) {
		throw new ApiError(400, 'Full name is required');
	}

	const existingUser = await prisma.user.findUnique({
		where: { email: payload.email },
		select: { id: true },
	});

	if (existingUser) {
		throw new ApiError(409, 'Email already exists');
	}

	const user = await prisma.user.create({
		data: {
			firstName,
			lastName,
			email: payload.email,
			passwordHash: await hashPassword(payload.password),
			role: Role.EMPLOYEE,
		},
		select: userSelect,
	});

	return buildAuthResponse(user);
};

const login = async (payload: AuthLoginInput): Promise<AuthResponseDto> => {
	const userRecord = await prisma.user.findUnique({
		where: { email: payload.email },
	});

	if (!userRecord || userRecord.deletedAt) {
		throw new ApiError(401, 'Invalid email or password');
	}

	const isPasswordValid = await comparePassword(payload.password, userRecord.passwordHash);

	if (!isPasswordValid) {
		throw new ApiError(401, 'Invalid email or password');
	}

	const user = await prisma.user.findUnique({
		where: { id: userRecord.id },
		select: userSelect,
	});

	if (!user) {
		throw new ApiError(404, 'User not found');
	}

	return buildAuthResponse(user);
};

const currentUser = async (userId: string): Promise<AuthUserDto> => {
	const user = await getUserById(userId);

	return mapUser(user);
};

export const authService = {
	register,
	login,
	currentUser,
};