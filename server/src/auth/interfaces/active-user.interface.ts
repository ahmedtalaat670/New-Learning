import { UserRoles } from 'src/users/enums/user-roles.enum';

export interface ActiveUser {
  sub: string;
  email: string;
  role: UserRoles;
}
