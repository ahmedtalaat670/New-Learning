import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from "@nestjs/common";
import { GoogleAuthenticationService } from "./providers/google-authentication.service";
import { GoogleTokenDto } from "./dtos/google-token.dto";
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { AuthType } from "../enums/auth-type.enum";
import { Auth } from "../decorators/auth.decorator";

@ApiTags("Google Authentication")
@Controller("google-authentication")
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  @Post()
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Authenticate a user with a Google ID token" })
  @ApiBody({ type: GoogleTokenDto })
  @ApiOkResponse({
    description: "Successfully authenticated.",
    schema: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Ahmed",
            },
            email: {
              type: "string",
              example: "ahmed@example.com",
            },
            id: {
              type: "string",
              example: "123-123-asd",
            },
            role: {
              type: "string",
              example: "USER",
            },
          },
        },
      },
    },
  })
  public async googleAuthenticate(
    @Body() googleTokenDto: GoogleTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.googleAuthenticationService.authenticate(googleTokenDto);

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    response.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return { user };
  }
}
