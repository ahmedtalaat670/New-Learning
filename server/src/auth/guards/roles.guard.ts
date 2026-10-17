import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from 'src/users/enums/user-roles.enum';
import { USER_ROLES_KEY } from '../constants/user-roles-key';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../constants/request-user-key';
import { ActiveUser } from '../interfaces/active-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      USER_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();

    const user = request[REQUEST_USER_KEY] as ActiveUser;

    if (!user || !user.role) {
      throw new ForbiddenException(
        'Access denied: User role information missing',
      );
    }

    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException('Access denied: Insufficient permissions');
    }

    return true;
  }
}
