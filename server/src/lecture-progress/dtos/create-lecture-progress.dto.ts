import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateLectureProgressDto {
  @ApiProperty({
    description: 'ID of the course progress record',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  courseProgressId!: number;

  @ApiProperty({
    description: 'ID of the lecture to mark as viewed/completed',
    example: 42,
  })
  @Type(() => Number)
  @IsInt()
  lectureId!: number;
}
