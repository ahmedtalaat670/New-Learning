import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthType } from '../enums/auth-type.enum';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './access-token.guard';
import { AUTH_TYPE_KEY } from '../constants/auth-type-key';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;
  private readonly authTypeGuardsMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  >;
  constructor(
    private readonly reflector: Reflector,

    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardsMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    const guards = authTypes.map((type) => this.authTypeGuardsMap[type]).flat();
    let error: any = new UnauthorizedException();
    for (const instance of guards) {
      if (!instance) continue;
      try {
        const canActivate = await instance.canActivate(context);
        if (canActivate) {
          return true;
        }
      } catch (err) {
        error =
          err instanceof Error ? err : new UnauthorizedException(String(err));
      }
    }
    throw error;
  }
}
