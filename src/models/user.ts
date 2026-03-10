/**
 * User/Staff Profile Model
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export const UserRole = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
  USER: "USER",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

/**
 * Current logged-in user info
 */
export interface CurrentUser extends User {
  permissions: string[];
}

/**
 * User request for creation/update
 */
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  department?: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {}
