import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStudentCourseDto {
  @ApiProperty({
    description:
      'The unique numeric identifier of the course the student wishes to enroll in',
    type: Number,
    example: 42,
  })
  @IsNumber()
  @IsNotEmpty()
  courseId!: number;
}
