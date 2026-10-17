import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RolesGuard } from './roles.guard';
import { UserRoles } from 'src/users/enums/user-roles.enum';
import { USER_ROLES_KEY } from '../constants/user-roles-key';
import { REQUEST_USER_KEY } from '../constants/request-user-key';
import { ActiveUser } from '../interfaces/active-user.interface';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  let getAllAndOverrideSpy: jest.Mock;

  beforeEach(async () => {
    getAllAndOverrideSpy = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: getAllAndOverrideSpy,
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    function createMockExecutionContext(userPayload?: Partial<ActiveUser>): {
      context: ExecutionContext;
      mockRequest: Record<string, any>;
    } {
      const mockRequest: Record<string, any> = {};
      if (userPayload) {
        mockRequest[REQUEST_USER_KEY] = userPayload;
      }

      const context = {
        getHandler: jest.fn().mockReturnValue('mockHandler'),
        getClass: jest.fn().mockReturnValue('mockClass'),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      return { context, mockRequest };
    }

    it('should allow access if no roles are required on the class or handler', () => {
      const { context } = createMockExecutionContext();
      getAllAndOverrideSpy.mockReturnValue(undefined);

      const canActivate = guard.canActivate(context);

      expect(getAllAndOverrideSpy).toHaveBeenCalledWith(USER_ROLES_KEY, [
        'mockHandler',
        'mockClass',
      ]);
      expect(canActivate).toBe(true);
    });

    it('should allow access if the required roles array is empty', () => {
      const { context } = createMockExecutionContext();
      getAllAndOverrideSpy.mockReturnValue([]);

      const canActivate = guard.canActivate(context);

      expect(canActivate).toBe(true);
    });

    it('should throw ForbiddenException if request user payload is missing entirely', () => {
      const { context } = createMockExecutionContext(undefined);
      getAllAndOverrideSpy.mockReturnValue([UserRoles.USER]);

      expect(() => guard.canActivate(context)).toThrow(
        new ForbiddenException('Access denied: User role information missing'),
      );
    });

    it('should throw ForbiddenException if request user payload lacks a role property', () => {
      const { context } = createMockExecutionContext({ sub: 'user-uuid' });
      getAllAndOverrideSpy.mockReturnValue([UserRoles.USER]);

      expect(() => guard.canActivate(context)).toThrow(
        new ForbiddenException('Access denied: User role information missing'),
      );
    });

    it('should throw ForbiddenException if user has a role but it does not match required roles', () => {
      const { context } = createMockExecutionContext({
        sub: 'user-uuid',
        role: UserRoles.USER,
      });

      getAllAndOverrideSpy.mockReturnValue([UserRoles.INSTRUCTOR]);

      expect(() => guard.canActivate(context)).toThrow(
        new ForbiddenException('Access denied: Insufficient permissions'),
      );
    });

    it('should allow access if user role matches one of the required roles', () => {
      const { context } = createMockExecutionContext({
        sub: 'user-uuid',
        role: UserRoles.USER,
      });
      getAllAndOverrideSpy.mockReturnValue([UserRoles.USER, UserRoles.USER]);

      const canActivate = guard.canActivate(context);

      expect(canActivate).toBe(true);
    });
  });
});
