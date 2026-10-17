import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthenticationGuard } from './authentication.guard';
import { AccessTokenGuard } from './access-token.guard';
import { AuthType } from '../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../constants/auth-type-key';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;

  let getAllAndOverrideSpy: jest.Mock;
  let accessTokenCanActivateSpy: jest.Mock<
    Promise<boolean>,
    [ExecutionContext]
  >;

  beforeEach(async () => {
    getAllAndOverrideSpy = jest.fn();
    accessTokenCanActivateSpy = jest.fn<Promise<boolean>, [ExecutionContext]>();

    const mockReflector = {
      getAllAndOverride: getAllAndOverrideSpy,
    };

    const mockAccessTokenGuard: CanActivate = {
      canActivate: accessTokenCanActivateSpy,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationGuard,
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: AccessTokenGuard,
          useValue: mockAccessTokenGuard,
        },
      ],
    }).compile();

    guard = module.get<AuthenticationGuard>(AuthenticationGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    function createMockExecutionContext(): ExecutionContext {
      return {
        getHandler: jest.fn().mockReturnValue('mockHandler'),
        getClass: jest.fn().mockReturnValue('mockClass'),
      } as unknown as ExecutionContext;
    }

    it('should fall back to default Bearer authentication if no auth type metadata is found', async () => {
      const context = createMockExecutionContext();

      getAllAndOverrideSpy.mockReturnValue(undefined);
      accessTokenCanActivateSpy.mockResolvedValue(true);

      const result = await guard.canActivate(context);

      expect(getAllAndOverrideSpy).toHaveBeenCalledWith(AUTH_TYPE_KEY, [
        'mockHandler',
        'mockClass',
      ]);
      expect(accessTokenCanActivateSpy).toHaveBeenCalledWith(context);
      expect(result).toBe(true);
    });

    it('should instantly allow access if AuthType is None', async () => {
      const context = createMockExecutionContext();
      getAllAndOverrideSpy.mockReturnValue([AuthType.None]);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(accessTokenCanActivateSpy).not.toHaveBeenCalled();
    });

    it('should authenticate successfully if at least one guard in the sequence returns true', async () => {
      const context = createMockExecutionContext();

      getAllAndOverrideSpy.mockReturnValue([AuthType.Bearer, AuthType.None]);

      accessTokenCanActivateSpy.mockResolvedValue(false);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException if no guards match or resolve successfully', async () => {
      const context = createMockExecutionContext();
      getAllAndOverrideSpy.mockReturnValue([AuthType.Bearer]);
      accessTokenCanActivateSpy.mockResolvedValue(false);

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should bubble up the specific error caught during guard execution checks', async () => {
      const context = createMockExecutionContext();
      const customException = new UnauthorizedException(
        'Custom JWT Expired Message',
      );

      getAllAndOverrideSpy.mockReturnValue([AuthType.Bearer]);
      accessTokenCanActivateSpy.mockRejectedValue(customException);

      await expect(guard.canActivate(context)).rejects.toThrow(customException);
    });

    it('should wrap plain non-Error rejections inside an UnauthorizedException', async () => {
      const context = createMockExecutionContext();
      getAllAndOverrideSpy.mockReturnValue([AuthType.Bearer]);

      accessTokenCanActivateSpy.mockRejectedValue('String Error Context');

      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException('String Error Context'),
      );
    });
  });
});
