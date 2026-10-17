import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import { AuthService } from './auth.service';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokenProvider } from './generate-token.provider';
import jwtConfig from '../config/jwt.config';

import { UserRoles } from 'src/users/enums/user-roles.enum';
import { SignInDto } from '../dtos/sign-in.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ActiveUser } from '../interfaces/active-user.interface';

interface MockUser {
  id: string;
  email: string;
  password?: string;
  googleId?: string;
  role: UserRoles;
}

describe('AuthService', () => {
  let service: AuthService;

  let findOneByEmailSpy: jest.Mock;
  let findOneByIdSpy: jest.Mock;
  let createUserSpy: jest.Mock;
  let comparePasswordSpy: jest.Mock;
  let hashingPasswordSpy: jest.Mock;
  let generateTokensSpy: jest.Mock;
  let verifyAsyncSpy: jest.Mock;

  const mockJwtConfig: ConfigType<typeof jwtConfig> = {
    secret: 'super-secret-key-123',
    audience: 'localhost:3000',
    issuer: 'localhost:3000',
    accessTokenTtl: 3600,
    refreshTokenTtl: 86400,
    googleClientId: 'mock-google-id',
    googleClientSecret: 'mock-google-secret',
  };

  beforeEach(async () => {
    findOneByEmailSpy = jest.fn();
    findOneByIdSpy = jest.fn();
    createUserSpy = jest.fn();
    comparePasswordSpy = jest.fn();
    hashingPasswordSpy = jest.fn();
    generateTokensSpy = jest.fn();
    verifyAsyncSpy = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: findOneByEmailSpy,
            findOneById: findOneByIdSpy,
            create: createUserSpy,
          },
        },
        {
          provide: HashingProvider,
          useValue: {
            comparePassword: comparePasswordSpy,
            hashingPassword: hashingPasswordSpy,
          },
        },
        {
          provide: GenerateTokenProvider,
          useValue: {
            generate: generateTokensSpy,
          },
        },
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

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    const signInDto: SignInDto = {
      email: 'user@nest.com',
      password: 'password123',
    };

    it('should throw UnauthorizedException if user does not exist', async () => {
      findOneByEmailSpy.mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        new UnauthorizedException('Invalid email or password'),
      );
    });

    it('should throw UnauthorizedException if user has a googleId but no native password', async () => {
      const mockUser: MockUser = {
        id: 'user-uuid-1',
        email: 'user@nest.com',
        googleId: 'google-sub-id',
        role: UserRoles.USER,
      };
      findOneByEmailSpy.mockResolvedValue(mockUser);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        new UnauthorizedException(
          'This account was created using Google Sign-In. Please log in with Google.',
        ),
      );
    });

    it('should throw UnauthorizedException if password comparison fails', async () => {
      const mockUser: MockUser = {
        id: 'user-uuid-1',
        email: 'user@nest.com',
        password: 'hashedpassword',
        role: UserRoles.USER,
      };
      findOneByEmailSpy.mockResolvedValue(mockUser);
      comparePasswordSpy.mockResolvedValue(false);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        new UnauthorizedException('Invalid email or password'),
      );
      expect(comparePasswordSpy).toHaveBeenCalledWith(
        signInDto.password,
        mockUser.password,
      );
    });

    it('should return tokens if credentials are correct', async () => {
      const mockUser: MockUser = {
        id: 'user-uuid-1',
        email: 'user@nest.com',
        password: 'hashedpassword',
        role: UserRoles.USER,
      };
      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      findOneByEmailSpy.mockResolvedValue(mockUser);
      comparePasswordSpy.mockResolvedValue(true);
      generateTokensSpy.mockResolvedValue(mockTokens);

      const result = await service.signIn(signInDto);

      expect(findOneByEmailSpy).toHaveBeenCalledWith(signInDto.email);
      expect(comparePasswordSpy).toHaveBeenCalledWith(
        signInDto.password,
        mockUser.password,
      );
      expect(generateTokensSpy).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual(mockTokens);
    });
  });

  describe('signUp', () => {
    const signUpDto: SignUpDto = {
      email: 'newuser@nest.com',
      password: 'newpassword123',
      name: 'testName',
    };

    it('should hash password, create user with default role, and return tokens', async () => {
      const hashedPassword = 'hashed-newpassword123';
      const createdUser: MockUser = {
        id: 'new-user-uuid',
        email: signUpDto.email,
        password: hashedPassword,
        role: UserRoles.USER,
      };
      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      hashingPasswordSpy.mockResolvedValue(hashedPassword);
      createUserSpy.mockResolvedValue(createdUser);
      generateTokensSpy.mockResolvedValue(mockTokens);

      const result = await service.signUp(signUpDto);

      expect(hashingPasswordSpy).toHaveBeenCalledWith(signUpDto.password);
      expect(createUserSpy).toHaveBeenCalledWith({
        ...signUpDto,
        password: hashedPassword,
        role: UserRoles.USER,
      });
      expect(generateTokensSpy).toHaveBeenCalledWith({
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
      });
      expect(result).toEqual(mockTokens);
    });

    it('should respect custom role provided in payload', async () => {
      const adminSignUpDto: SignUpDto = {
        ...signUpDto,
        role: UserRoles.USER,
      };
      const createdAdmin: MockUser = {
        id: 'admin-uuid',
        email: adminSignUpDto.email,
        password: 'hashed-password',
        role: UserRoles.USER,
      };

      hashingPasswordSpy.mockResolvedValue('hashed-password');
      createUserSpy.mockResolvedValue(createdAdmin);
      generateTokensSpy.mockResolvedValue({
        accessToken: 'tok',
        refreshToken: 'tok',
      });

      await service.signUp(adminSignUpDto);

      expect(createUserSpy).toHaveBeenCalledWith(
        expect.objectContaining({ role: UserRoles.USER }),
      );
    });
  });

  describe('refreshToken', () => {
    it('should verify the token, resolve the user, and return newly generated tokens', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'valid-refresh-token-string',
      };

      const mockPayload: ActiveUser = {
        sub: 'user-uuid-777',
        email: 'user@nest.com',
        role: UserRoles.USER,
      };

      const mockUser: MockUser = {
        id: 'user-uuid-777',
        email: 'user@nest.com',
        role: UserRoles.USER,
      };

      const mockTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      verifyAsyncSpy.mockResolvedValue(mockPayload);
      findOneByIdSpy.mockResolvedValue(mockUser);
      generateTokensSpy.mockResolvedValue(mockTokens);

      const result = await service.refreshToken(refreshTokenDto);

      expect(verifyAsyncSpy).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
        {
          issuer: mockJwtConfig.issuer,
          audience: mockJwtConfig.audience,
          secret: mockJwtConfig.secret,
        },
      );
      expect(findOneByIdSpy).toHaveBeenCalledWith({ userId: mockPayload.sub });
      expect(generateTokensSpy).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual(mockTokens);
    });
  });
});
