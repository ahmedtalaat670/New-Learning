import { IsInt } from 'class-validator';

export class CreateCourseProgressDto {
  @IsInt()
  courseId!: number;
}
