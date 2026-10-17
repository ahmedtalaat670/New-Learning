import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthenticationController } from './social/google-authentication.controller';
import { GoogleAuthenticationService } from './social/providers/google-authentication.service';
import { GoogleTokenDto } from './social/dtos/google-token.dto';

describe('GoogleAuthenticationController', () => {
  let controller: GoogleAuthenticationController;

  let authenticateSpy: jest.Mock;

  const mockTokens = {
    accessToken: 'mock-access-token-777',
    refreshToken: 'mock-refresh-token-888',
  };

  beforeEach(async () => {
    authenticateSpy = jest.fn();

    const mockGoogleAuthService = {
      authenticate: authenticateSpy,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleAuthenticationController],
      providers: [
        {
          provide: GoogleAuthenticationService,
          useValue: mockGoogleAuthService,
        },
      ],
    }).compile();

    controller = module.get<GoogleAuthenticationController>(
      GoogleAuthenticationController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('googleAuthenticate', () => {
    it('should delegate the GoogleTokenDto to GoogleAuthenticationService and return tokens', async () => {
      const googleTokenDto: GoogleTokenDto = {
        token: 'valid-google-id-token-xyz',
      };

      authenticateSpy.mockResolvedValue(mockTokens);

      const result = await controller.googleAuthenticate(googleTokenDto);

      expect(authenticateSpy).toHaveBeenCalledWith(googleTokenDto);
      expect(result).toEqual(mockTokens);
    });
  });
});
