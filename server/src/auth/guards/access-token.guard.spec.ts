import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import { AccessTokenGuard } from './access-token.guard';
import jwtConfig from '../config/jwt.config';
import { REQUEST_USER_KEY } from '../constants/request-user-key';
import { ActiveUser } from '../interfaces/active-user.interface';
import { UserRoles } from 'src/users/enums/user-roles.enum';

describe('AccessTokenGuard', () => {
  let guard: AccessTokenGuard;

  let verifyAsyncSpy: jest.Mock;

  const mockJwtConfig: ConfigType<typeof jwtConfig> = {
    secret: 'test-secret-key-999',
    audience: 'localhost:3000',
    issuer: 'localhost:3000',
    accessTokenTtl: 3600,
    refreshTokenTtl: 86400,
    googleClientId: 'mock-google-id',
    googleClientSecret: 'mock-google-secret',
  };

  beforeEach(async () => {
    verifyAsyncSpy = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessTokenGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: verifyAsyncSpy,
          },
        },
        {
          provide: jwtConfig.KEY,
          useValue: mockJwtConfig,
        },
      ],
    }).compile();

    guard = module.get<AccessTokenGuard>(AccessTokenGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    function createMockExecutionContext(authHeaderValue?: string): {
      context: ExecutionContext;
      mockRequest: Record<string, any>;
    } {
      const mockRequest: Record<string, any> = {
        headers: {
          authorization: authHeaderValue,
        },
      };

      const context = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      return { context, mockRequest };
    }

    it('should throw UnauthorizedException if authorization header is missing', async () => {
      const { context } = createMockExecutionContext(undefined);

      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException('Missing or malformed authentication token'),
      );
    });

    it('should throw UnauthorizedException if Authorization header is improperly structured', async () => {
      const { context } = createMockExecutionContext(
        'only-token-string-no-prefix',
      );

      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException('Missing or malformed authentication token'),
      );
    });

    it('should throw UnauthorizedException if JwtService token verification fails', async () => {
      const { context } = createMockExecutionContext(
        'Bearer invalid-jwt-token',
      );

      verifyAsyncSpy.mockRejectedValue(new Error('Token expired'));

      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException('Invalid or expired token'),
      );

      expect(verifyAsyncSpy).toHaveBeenCalledWith(
        'invalid-jwt-token',
        mockJwtConfig,
      );
    });

    it('should assign user payload to request and return true on successful token verification', async () => {
      const { context, mockRequest } = createMockExecutionContext(
        'Bearer valid-jwt-token',
      );

      const mockPayload: ActiveUser = {
        sub: 'user-uuid-123',
        email: 'dev@nest.js',
        role: UserRoles.USER,
      };

      verifyAsyncSpy.mockResolvedValue(mockPayload);

      const canActivate = await guard.canActivate(context);

      expect(verifyAsyncSpy).toHaveBeenCalledWith(
        'valid-jwt-token',
        mockJwtConfig,
      );
      expect(mockRequest[REQUEST_USER_KEY]).toEqual(mockPayload);
      expect(canActivate).toBe(true);
    });
  });
});
