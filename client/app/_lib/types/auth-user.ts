export type UserRole = "USER" | "INSTRUCTOR";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}