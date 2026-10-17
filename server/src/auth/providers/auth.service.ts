import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/sign-in.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokenProvider } from './generate-token.provider';
import { SignUpDto } from '../dtos/sign-up.dto';
import { UserRoles } from 'src/users/enums/user-roles.enum';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { ActiveUser } from '../interfaces/active-user.interface';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { User } from '../interfaces/user.interface';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,

    private readonly hashingProvider: HashingProvider,

    private readonly generateTokenProvider: GenerateTokenProvider,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly jwtService: JwtService,
  ) {}

  public async signIn(signInDto: SignInDto, response: Response) {
    const user = await this.usersService.findOneByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (user.googleId || !user.password) {
      throw new UnauthorizedException(
        'This account was created using Google Sign-In. Please log in with Google.',
      );
    }
    const isAuthorized = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password,
    );
    if (!isAuthorized) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return await this.returnTokens(user, response);
  }

  public async signUp(signUpDto: SignUpDto, response: Response) {
    const hashedPassword = await this.hashingProvider.hashingPassword(
      signUpDto.password,
    );
    const role = signUpDto.role ?? UserRoles.USER;
    const user = await this.usersService.create({
      ...signUpDto,
      password: hashedPassword,
      role,
    });

    return await this.returnTokens(user, response);
  }

  public async refreshToken(request: Request, response: Response) {
    const refreshToken = request.cookies.refreshToken as string;
    console.log(request.cookies);
    if (!refreshToken) {
      throw new UnauthorizedException('you are not authorized');
    }
    const payload = await this.jwtService
      .verifyAsync<ActiveUser>(refreshToken, {
        issuer: this.jwtConfiguration.issuer,
        audience: this.jwtConfiguration.audience,
        secret: this.jwtConfiguration.secret,
      })
      .catch(() => {
        throw new UnauthorizedException('refresh token is not valid');
      });
    const user = await this.usersService.findOneById({ userId: payload.sub });
    return await this.returnTokens(user, response);
  }

  private async returnTokens(user: User, response: Response) {
    const { accessToken, refreshToken } =
      await this.generateTokenProvider.generate({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { user };
  }
}
