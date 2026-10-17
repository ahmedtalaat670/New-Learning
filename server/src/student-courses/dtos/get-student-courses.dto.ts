import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class GetStudentCoursesDto {
  @ApiPropertyOptional({
    description: 'Number of enrollment records to return per page',
    minimum: 1,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  limit?: number;

  @ApiPropertyOptional({
    description: 'The target page number of the paginated enrollment list',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  page?: number;
}
