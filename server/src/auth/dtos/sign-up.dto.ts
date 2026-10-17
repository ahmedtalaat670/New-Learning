import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { UserRoles } from 'src/users/enums/user-roles.enum';

export class SignUpDto {
  @ApiProperty({
    example: 'Ahmed',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @Length(3, 20)
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'ahmed@example.com',
    format: 'email',
  })
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'StrongP@ss1',
    minLength: 8,
    maxLength: 50,
    description:
      'Must contain uppercase, lowercase, a number, and a special character.',
  })
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

  @ApiPropertyOptional({
    enum: UserRoles,
    example: UserRoles.USER,
  })
  @IsEnum(UserRoles)
  @IsOptional()
  role?: UserRoles;
}
