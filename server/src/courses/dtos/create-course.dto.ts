import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { CourseCategoryEnum } from '../enums/category.enum';
import { CourseLevelEnum } from '../enums/level.enum';
import { CoursePrimaryLanguageEnum } from '../enums/primary-language.enum';
import { CreateLectureDto } from 'src/lectures/dtos/create-lecture.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    description: 'The main title of the course',
    minLength: 3,
    maxLength: 96,
    example: 'Introduction to NestJS Microservices',
  })
  @IsString()
  @Length(3, 96)
  title!: string;

  @ApiProperty({
    description: 'The industry sector or topic category of the course',
    enum: CourseCategoryEnum,
    example: CourseCategoryEnum.BACKEND_DEVELOPMENT,
  })
  @IsEnum(CourseCategoryEnum)
  category!: CourseCategoryEnum;

  @ApiProperty({
    description: 'Target experience level for the student audience',
    enum: CourseLevelEnum,
    example: CourseLevelEnum.BEGINNER,
  })
  @IsEnum(CourseLevelEnum)
  level!: CourseLevelEnum;

  @ApiProperty({
    description:
      'The primary spoken or instructional language used in the video lectures',
    enum: CoursePrimaryLanguageEnum,
    example: CoursePrimaryLanguageEnum.ENGLISH,
  })
  @IsEnum(CoursePrimaryLanguageEnum)
  primaryLanguage!: CoursePrimaryLanguageEnum;

  @ApiProperty({
    description: 'A catchy, brief subtitle summarizing the value proposition',
    minLength: 3,
    maxLength: 50,
    example: 'Build scalable backend applications with confidence.',
  })
  @IsString()
  @Length(3, 50)
  subtitle!: string;

  @ApiProperty({
    description:
      'Comprehensive detailed Markdown or rich text breakdown of the course syllabus',
    example:
      'In this course, you will learn the core foundations of architecture...',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    description:
      'The cost of the course in cents (e.g., $19.99 = 1999) or local currency integer units',
    minimum: 0,
    example: 4999,
  })
  @IsInt()
  @Min(0)
  pricing!: number;

  @ApiProperty({
    description:
      'What the student will be able to do or build after finishing this course',
    example: 'Design modular systems, write unit tests, structure REST APIs.',
  })
  @IsString()
  objectives!: string;

  @ApiProperty({
    description:
      'An automatic text notification sent to students immediately upon purchase hook',
    example: 'Welcome aboard! Get ready to level up your engineering skills.',
  })
  @IsString()
  welcomeMessage!: string;

  @ApiProperty({
    description:
      'URL pointing to the public storage bucket containing the course thumbnail image',
    example: 'https://cdn.example.com/images/nestjs-thumbnail.png',
  })
  @IsString()
  image!: string;

  @ApiPropertyOptional({
    description:
      'Visibility status determining if the course is visible to public search',
    default: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({
    description:
      'An initial collection of nested lectures to create simultaneously with the course',
    type: [CreateLectureDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateLectureDto)
  lectures?: CreateLectureDto[];
}
