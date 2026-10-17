import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { UserRoles } from '../enums/user-roles.enum';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @Length(8, 50)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password!: string;

  @IsEnum(UserRoles)
  role!: UserRoles;
}
