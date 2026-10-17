import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { GenerateTokenDto } from '../dtos/generate-token.dto';

@Injectable()
export class GenerateTokenProvider {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  private async signToken(
    generateTokenDto: GenerateTokenDto,
    expiresIn: number,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: generateTokenDto.id,
        email: generateTokenDto.email,
        role: generateTokenDto.role,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }

  public async generate(generateTokenDto: GenerateTokenDto) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(generateTokenDto, this.jwtConfiguration.accessTokenTtl),
      this.signToken(generateTokenDto, this.jwtConfiguration.refreshTokenTtl),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
