import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRoles } from '../enums/user-roles.enum';

export class GoogleUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  googleId!: string;

  @IsEnum(UserRoles)
  @IsOptional()
  role?: UserRoles;
}
