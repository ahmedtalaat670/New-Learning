import { UserRoles } from 'src/users/enums/user-roles.enum';

export interface User {
  id: string;
  email: string;
  role: UserRoles;
}
