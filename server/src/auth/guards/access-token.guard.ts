import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { REQUEST_USER_KEY } from '../constants/request-user-key';
import { ActiveUser } from '../interfaces/active-user.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException(
        'Missing or malformed authentication token',
      );
    }

    try {
      const payload: ActiveUser = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }
  private extractToken(request: Request): string | undefined {
    const accessToken = request.cookies?.accessToken as string;
    if (accessToken) {
      return accessToken;
    }

    const [, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
