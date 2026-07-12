export const Roles = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE',
  ASSET_MANAGER: 'ASSET_MANAGER',
  DEPARTMENT_HEAD: 'DEPARTMENT_HEAD',
} as const;

export type AppRole = (typeof Roles)[keyof typeof Roles];

export const ASSIGNABLE_ROLES = [
  Roles.EMPLOYEE,
  Roles.ASSET_MANAGER,
  Roles.DEPARTMENT_HEAD,
] as const;
