import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GoogleTokenDto {
  @ApiProperty({
    description: 'Google ID token obtained from the Google Sign-In flow',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6...',
  })
  @IsNotEmpty()
  token!: string;
}
