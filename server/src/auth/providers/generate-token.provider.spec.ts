import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokenProvider } from './generate-token.provider';
import jwtConfig from '../config/jwt.config';
import { GenerateTokenDto } from '../dtos/generate-token.dto';
import { ConfigType } from '@nestjs/config';
import { UserRoles } from 'src/users/enums/user-roles.enum';

describe('GenerateTokenProvider', () => {
  let provider: GenerateTokenProvider;

  let signAsyncSpy: jest.Mock<Promise<string>, [Record<string, any>, any?]>;

  const mockJwtConfig: ConfigType<typeof jwtConfig> = {
    secret: 'super-secret-key-123',
    audience: 'localhost:3000',
    issuer: 'localhost:3000',
    accessTokenTtl: 3600,
    refreshTokenTtl: 86400,
    googleClientId: 'mock-google-client-id.apps.googleusercontent.com',
    googleClientSecret: 'mock-google-client-secret-123',
  };

  beforeEach(async () => {
    signAsyncSpy = jest.fn<Promise<string>, [Record<string, any>, any?]>();

    const mockJwtService = {
      signAsync: signAsyncSpy,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateTokenProvider,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: jwtConfig.KEY,
          useValue: mockJwtConfig,
        },
      ],
    }).compile();

    provider = module.get<GenerateTokenProvider>(GenerateTokenProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('generate', () => {
    it('should simultaneously generate access and refresh tokens using configurations', async () => {
      const generateTokenDto: GenerateTokenDto = {
        id: 'user-uuid-999',
        email: 'developer@nest.js',
        role: UserRoles.USER,
      };

      signAsyncSpy
        .mockResolvedValueOnce('mocked-access-token')
        .mockResolvedValueOnce('mocked-refresh-token');

      const result = await provider.generate(generateTokenDto);

      expect(result).toEqual({
        accessToken: 'mocked-access-token',
        refreshToken: 'mocked-refresh-token',
      });

      expect(signAsyncSpy).toHaveBeenCalledTimes(2);

      expect(signAsyncSpy).toHaveBeenNthCalledWith(
        1,
        {
          sub: generateTokenDto.id,
          email: generateTokenDto.email,
          role: generateTokenDto.role,
        },
        {
          audience: mockJwtConfig.audience,
          issuer: mockJwtConfig.issuer,
          secret: mockJwtConfig.secret,
          expiresIn: mockJwtConfig.accessTokenTtl,
        },
      );

      expect(signAsyncSpy).toHaveBeenNthCalledWith(
        2,
        {
          sub: generateTokenDto.id,
          email: generateTokenDto.email,
          role: generateTokenDto.role,
        },
        {
          audience: mockJwtConfig.audience,
          issuer: mockJwtConfig.issuer,
          secret: mockJwtConfig.secret,
          expiresIn: mockJwtConfig.refreshTokenTtl,
        },
      );
    });
  });
});
