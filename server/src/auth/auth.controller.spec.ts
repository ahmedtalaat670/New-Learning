import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

describe('AuthController', () => {
  let controller: AuthController;

  let signInSpy: jest.Mock;
  let signUpSpy: jest.Mock;
  let refreshTokenSpy: jest.Mock;

  const mockTokens = {
    accessToken: 'mock-access-token-123',
    refreshToken: 'mock-refresh-token-456',
  };

  beforeEach(async () => {
    signInSpy = jest.fn();
    signUpSpy = jest.fn();
    refreshTokenSpy = jest.fn();

    const mockAuthService = {
      signIn: signInSpy,
      signUp: signUpSpy,
      refreshToken: refreshTokenSpy,
    };

    // 2. Compile our TestingModule
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should delegate credentials to authService.signIn and return tokens', async () => {
      const signInDto: SignInDto = {
        email: 'student@nest.edu',
        password: 'securePassword123',
      };

      signInSpy.mockResolvedValue(mockTokens);

      const result = await controller.signIn(signInDto);

      expect(signInSpy).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(mockTokens);
    });
  });

  describe('signUp', () => {
    it('should delegate sign-up payload to authService.signUp and return tokens', async () => {
      const signUpDto: SignUpDto = {
        email: 'newstudent@nest.edu',
        password: 'securePassword123',
        name: 'testName',
      };

      signUpSpy.mockResolvedValue(mockTokens);

      const result = await controller.signUp(signUpDto);

      expect(signUpSpy).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual(mockTokens);
    });
  });

  describe('userRefreshToken', () => {
    it('should delegate refresh token to authService.refreshToken and return new tokens', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'valid-refresh-token-jwt',
      };

      refreshTokenSpy.mockResolvedValue(mockTokens);

      const result = await controller.userRefreshToken(refreshTokenDto);

      expect(refreshTokenSpy).toHaveBeenCalledWith(refreshTokenDto);
      expect(result).toEqual(mockTokens);
    });
  });
});
