import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/users/enums/user-roles.enum';
import { USER_ROLES_KEY } from '../constants/user-roles-key';

export const Roles = (...roles: UserRoles[]) =>
  SetMetadata(USER_ROLES_KEY, roles);
