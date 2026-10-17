import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CourseProgressService } from './providers/course-progress.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/users/enums/user-roles.enum';
import { User } from 'src/auth/decorators/active-user.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Course Progress')
@ApiBearerAuth()
@Controller('course-progress')
export class CourseProgressController {
  constructor(
    @Inject()
    private readonly courseProgressService: CourseProgressService,
  ) {}

  @Get()
  @Roles(UserRoles.USER)
  @ApiOperation({
    summary: 'Get the current user’s progress for a course',
    description:
      'Retrieves calculated metrics, completed lectures, and total progress status for the logged-in student.',
  })
  @ApiQuery({
    name: 'courseId',
    type: Number,
    required: true,
    description: 'The unique numeric identifier of the course',
    example: 42,
  })
  @ApiOkResponse({
    description: 'Course progress metrics computed and retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 12 },
        completed: { type: 'boolean', example: false },
        completionDate: { type: 'string', example: '2026-07-13T06:52:44.720Z' },
        createdAt: { type: 'string', example: '2026-07-13T06:52:44.720Z' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid courseId query parameter value supplied.',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or malformed authorization bearer token.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource. Student role access mismatch.',
  })
  @ApiNotFoundResponse({
    description:
      'No active enrollment or progress tracked for this course context.',
  })
  public findCourseProgress(
    @Query('courseId', ParseIntPipe) courseId: number,
    @User('sub') sub: string,
  ) {
    return this.courseProgressService.findOne(courseId, sub);
  }

  @Delete(':courseProgressId')
  @Roles(UserRoles.USER)
  @ApiOperation({
    summary: 'Reset or delete a course progress record',
    description:
      'Removes the target historical progress logs and completed checkmarks for a student.',
  })
  @ApiParam({
    name: 'courseProgressId',
    type: Number,
    description:
      'The numeric database key of the target course progress registry entry',
    example: 1,
  })
  @ApiNoContentResponse({
    description:
      'Course progress registry item successfully destroyed. No body returned.',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or malformed authorization bearer token.',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden resource. Action unauthorized for this profile identity.',
  })
  @ApiNotFoundResponse({
    description: 'Target progress tracking registry reference not found.',
  })
  public deleteCourseProgress(
    @Param('courseProgressId', ParseIntPipe) courseProgressId: number,
    @User('sub') sub: string,
  ) {
    return this.courseProgressService.delete(courseProgressId, sub);
  }
}
