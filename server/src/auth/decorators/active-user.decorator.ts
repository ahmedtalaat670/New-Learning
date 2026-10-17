import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUser } from '../interfaces/active-user.interface';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../constants/request-user-key';

export const User = createParamDecorator(
  <T extends keyof ActiveUser | undefined = undefined>(
    field: T,
    ctx: ExecutionContext,
  ): (T extends keyof ActiveUser ? ActiveUser[T] : ActiveUser) | undefined => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY] as ActiveUser | undefined;
    if (!user) return undefined;

    const result = field ? user[field] : user;
    return result as T extends keyof ActiveUser ? ActiveUser[T] : ActiveUser;
  },
);
