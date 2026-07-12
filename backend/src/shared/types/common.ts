import type { Role } from '@prisma/client';

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export type AuthenticatedUser = {
	id: string;
	email: string;
	role: Role;
	departmentId?: string | null;
};