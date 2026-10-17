import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { CourseCategoryEnum } from '../enums/category.enum';
import { CourseLevelEnum } from '../enums/level.enum';
import { CoursePrimaryLanguageEnum } from '../enums/primary-language.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetCoursesDto {
  @ApiPropertyOptional({
    description: 'Number of records to return per page',
    minimum: 1,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'The target page number to retrieve',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Filter courses by one or more categories',
    enum: CourseCategoryEnum,
    isArray: true,
    example: [CourseCategoryEnum.CLOUD_COMPUTING],
  })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? (value as CourseCategoryEnum[])
      : [value as CourseCategoryEnum],
  )
  @IsEnum(CourseCategoryEnum, { each: true })
  category?: CourseCategoryEnum[];

  @ApiPropertyOptional({
    description: 'Filter courses by target audience difficulty levels',
    enum: CourseLevelEnum,
    isArray: true,
    example: [CourseLevelEnum.BEGINNER],
  })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? (value as CourseLevelEnum[])
      : [value as CourseLevelEnum],
  )
  @IsEnum(CourseLevelEnum, { each: true })
  level?: CourseLevelEnum[];

  @ApiPropertyOptional({
    description: 'Filter courses by spoken instructional languages',
    enum: CoursePrimaryLanguageEnum,
    isArray: true,
    example: [CoursePrimaryLanguageEnum.ENGLISH],
  })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? (value as CoursePrimaryLanguageEnum[])
      : [value as CoursePrimaryLanguageEnum],
  )
  @IsEnum(CoursePrimaryLanguageEnum, { each: true })
  primaryLanguage?: CoursePrimaryLanguageEnum[];
}
