import { IsEmail, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { UserRoles } from 'src/users/enums/user-roles.enum';

export class GenerateTokenDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsEmail()
  email!: string;

  @IsEnum(UserRoles)
  role!: UserRoles;
}
