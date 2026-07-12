import { Role, type Prisma } from '@prisma/client';
import crypto from 'crypto';

import { prisma } from '@config/prisma';
import { ApiError } from '@shared/errors/ApiError';
import { comparePassword, hashPassword } from '@shared/utils/hash';
import { signToken } from '@shared/utils/token';

import type {
  AuthLoginInput,
  ForgotPasswordInput,
  ForgotPasswordResponseDto,
  AuthRegisterInput,
  AuthResponseDto,
  AuthUserDto,
  ResetPasswordInput,
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
  tokenVersion: true,
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
    tokenVersion: user.tokenVersion,
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

const hashResetToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const createResetLink = (token: string): string => {
  return `${process.env.CLIENT_URL ?? 'http://localhost:3000'}/reset-password?token=${token}`;
};

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

const forgotPassword = async (payload: ForgotPasswordInput): Promise<ForgotPasswordResponseDto> => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    select: { id: true, email: true, deletedAt: true },
  });

  if (!user || user.deletedAt) {
    return {};
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = hashResetToken(resetToken);
  const resetTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetTokenHash: resetTokenHash,
      passwordResetTokenExpiresAt: resetTokenExpiresAt,
    },
  });

  return {
    resetLink: createResetLink(resetToken),
  };
};

const resetPassword = async (payload: ResetPasswordInput): Promise<void> => {
  const tokenHash = hashResetToken(payload.token);

  const user = await prisma.user.findFirst({
    where: {
      passwordResetTokenHash: tokenHash,
      passwordResetTokenExpiresAt: {
        gt: new Date(),
      },
      deletedAt: null,
    },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(payload.password),
      passwordResetTokenHash: null,
      passwordResetTokenExpiresAt: null,
      tokenVersion: { increment: 1 },
    },
  });
};

const currentUser = async (userId: string): Promise<AuthUserDto> => {
  const user = await getUserById(userId);

  return mapUser(user);
};

export const authService = {
  register,
  login,
  forgotPassword,
  resetPassword,
  currentUser,
};
