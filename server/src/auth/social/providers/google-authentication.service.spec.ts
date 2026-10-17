import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthenticationService } from './google-authentication.service';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokenProvider } from 'src/auth/providers/generate-token.provider';
import jwtConfig from 'src/auth/config/jwt.config';
import { UnauthorizedException } from '@nestjs/common';
import { GoogleTokenDto } from '../dtos/google-token.dto';

const mockVerifyIdToken = jest.fn();

jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => {
      return {
        verifyIdToken: mockVerifyIdToken,
      };
    }),
  };
});

describe('GoogleAuthenticationService', () => {
  let service: GoogleAuthenticationService;

  let findOneByGoogleIdSpy: jest.Mock;
  let createGoogleUserSpy: jest.Mock;
  let generateSpy: jest.Mock;

  const mockJwtConfigValues = {
    googleClientId: 'mock-google-client-id',
    googleClientSecret: 'mock-google-client-secret',
  };

  const mockPayload = {
    email: 'student@nest.edu',
    sub: 'google-id-123',
    given_name: 'John',
    family_name: 'Doe',
  };

  const mockUser = {
    id: 'user-id-abc',
    email: 'student@nest.edu',
    googleId: 'google-id-123',
    name: 'John Doe',
  };

  const mockTokens = {
    accessToken: 'access-token-xyz',
    refreshToken: 'refresh-token-123',
  };

  const googleTokenDto: GoogleTokenDto = {
    token: 'mock-valid-google-id-token',
  };

  beforeEach(async () => {
    findOneByGoogleIdSpy = jest.fn();
    createGoogleUserSpy = jest.fn();
    generateSpy = jest.fn();

    const mockUsersService = {
      findOneByGoogleId: findOneByGoogleIdSpy,
      createGoogleUser: createGoogleUserSpy,
    };

    const mockGenerateTokenProvider = {
      generate: generateSpy,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleAuthenticationService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: GenerateTokenProvider,
          useValue: mockGenerateTokenProvider,
        },
        {
          provide: jwtConfig.KEY,
          useValue: mockJwtConfigValues,
        },
      ],
    }).compile();

    service = module.get<GoogleAuthenticationService>(
      GoogleAuthenticationService,
    );

    service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authenticate', () => {
    it('should authenticate an existing Google user and return tokens', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => mockPayload,
      });

      findOneByGoogleIdSpy.mockResolvedValue(mockUser);
      generateSpy.mockResolvedValue(mockTokens);

      const result = await service.authenticate(googleTokenDto);

      expect(mockVerifyIdToken).toHaveBeenCalledWith({
        idToken: googleTokenDto.token,
        audience: mockJwtConfigValues.googleClientId,
      });
      expect(findOneByGoogleIdSpy).toHaveBeenCalledWith('google-id-123');
      expect(createGoogleUserSpy).not.toHaveBeenCalled();
      expect(generateSpy).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockTokens);
    });

    it('should create a new user and return tokens if Google user does not exist', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => mockPayload,
      });

      findOneByGoogleIdSpy.mockResolvedValue(null);

      const createdUser = { ...mockUser };
      createGoogleUserSpy.mockResolvedValue(createdUser);
      generateSpy.mockResolvedValue(mockTokens);

      const result = await service.authenticate(googleTokenDto);

      expect(findOneByGoogleIdSpy).toHaveBeenCalledWith('google-id-123');
      expect(createGoogleUserSpy).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'student@nest.edu',
        googleId: 'google-id-123',
      });
      expect(generateSpy).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(mockTokens);
    });

    it('should throw UnauthorizedException if ticket payload is empty', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => null,
      });

      await expect(service.authenticate(googleTokenDto)).rejects.toThrow(
        new UnauthorizedException('invalid google token'),
      );

      expect(findOneByGoogleIdSpy).not.toHaveBeenCalled();
      expect(generateSpy).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if Google token verification throws an error', async () => {
      mockVerifyIdToken.mockRejectedValue(new Error('Token expired'));

      await expect(service.authenticate(googleTokenDto)).rejects.toThrow(
        new UnauthorizedException('invalid google token'),
      );

      expect(findOneByGoogleIdSpy).not.toHaveBeenCalled();
      expect(generateSpy).not.toHaveBeenCalled();
    });
  });
});
