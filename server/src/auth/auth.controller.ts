import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { AuthService } from "./providers/auth.service";
import { SignInDto } from "./dtos/sign-in.dto";
import { SignUpDto } from "./dtos/sign-up.dto";
import { Auth } from "./decorators/auth.decorator";
import { AuthType } from "./enums/auth-type.enum";
import { RefreshTokenDto } from "./dtos/refresh-token.dto";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import type { Request, Response } from "express";

@ApiTags("Authentication")
@Controller("auth")
@Auth(AuthType.None)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Sign in a user",
    description:
      "Authenticates user credentials against the database and issues fresh JSON Web Tokens (JWT).",
  })
  @ApiBody({ type: SignInDto })
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
  @ApiBadRequestResponse({
    description: "Validation failure on payload inputs.",
  })
  @ApiUnauthorizedResponse({
    description: "Invalid email address or password credentials provided.",
  })
  public signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signIn(signInDto, response);
  }

  @Post("sign-up")
  @ApiOperation({
    summary: "Register a new user account",
    description:
      "Provisions a new user in the database system and returns an authorization token context block.",
  })
  @ApiBody({ type: SignUpDto })
  @ApiCreatedResponse({
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
  @ApiConflictResponse({
    description:
      "Email already exists or payload inputs failed security checking guidelines.",
  })
  public signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signUp(signUpDto, response);
  }

  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Refresh an access token",
    description:
      "Exchanges a valid, unexpired refresh token for a newly generated short-lived access token session.",
  })
  @ApiBody({ type: RefreshTokenDto })
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
  @ApiUnauthorizedResponse({
    description:
      "Provided refresh token signature is revoked, modified, or expired.",
  })
  public userRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshToken(request, response);
  }
  @Post("logout")
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    response.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return {
      message: "Logged out successfully",
    };
  }
}
