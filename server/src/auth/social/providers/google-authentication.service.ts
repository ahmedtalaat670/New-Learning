import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GenerateTokenProvider } from 'src/auth/providers/generate-token.provider';
import { UsersService } from 'src/users/providers/users.service';
import { GoogleTokenDto } from '../dtos/google-token.dto';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private readonly logger = new Logger(GoogleAuthenticationService.name);
  private oauthClient!: OAuth2Client;

  constructor(
    private readonly usersService: UsersService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}

  onModuleInit() {
    this.oauthClient = new OAuth2Client(this.jwtConfiguration.googleClientId);
  }

  async authenticate(googleTokenDto: GoogleTokenDto) {
    let payload: TokenPayload | undefined;

    try {
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
        audience: this.jwtConfiguration.googleClientId,
      });

      payload = ticket.getPayload();
    } catch (error) {
      this.logger.warn(
        `Google ID token verification failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );

      throw new UnauthorizedException('Invalid Google ID token.');
    }

    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException(
        'Google token is missing required account information.',
      );
    }

    if (payload.email_verified !== true) {
      throw new UnauthorizedException('Google email address is not verified.');
    }

    const googleId = payload.sub;

    let user = await this.usersService.findOneByGoogleId(googleId);

    if (!user) {
      user = await this.usersService.createGoogleUser({
        name: [payload.given_name, payload.family_name]
          .filter(Boolean)
          .join(' '),
        email: payload.email,
        googleId,
      });
    }

    const { accessToken, refreshToken } =
      await this.generateTokenProvider.generate({
        id: user.id,
        email: user.email,
        role: user.role,
      });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
