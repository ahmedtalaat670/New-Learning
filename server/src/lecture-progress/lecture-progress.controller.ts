import {
  Body,
  Controller,
  Get,
  Inject,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { LectureProgressService } from './providers/lecture-progress.service';
import { CreateLectureProgressDto } from './dtos/create-lecture-progress.dto';
import { User } from 'src/auth/decorators/active-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/users/enums/user-roles.enum';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Lecture Progress')
@ApiBearerAuth()
@Controller('lecture-progress')
export class LectureProgressController {
  constructor(
    @Inject()
    private readonly lectureProgressService: LectureProgressService,
  ) {}

  @Get()
  @Roles(UserRoles.USER)
  @ApiOperation({
    summary: 'Get all lecture progress entries for a course progress record',
    description:
      'Retrieves an array of all historical completion logs for individual lectures tied to a specific student course progress context.',
  })
  @ApiQuery({
    name: 'courseProgressId',
    type: Number,
    required: true,
    description:
      'The unique numeric identifier of the overarching parent course progress record',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Lecture progress tracking collection retrieved successfully.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 501 },
          lecture: {
            properties: {
              id: { type: 'number', example: 3 },
              title: { type: 'string', example: 'lecture title' },
              freePreview: { type: 'boolean', example: false },
              video: { type: 'string', example: 'video url' },
            },
          },
          userId: { type: 'string', example: 'asd12-wdsds-asd45' },
          viewDate: {
            type: 'string',
            format: 'date-time',
            example: '2026-07-12T21:21:00Z',
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid or malformed courseProgressId parameter supplied.',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or expired authorization bearer token.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource. Student role profile mismatch.',
  })
  public findAll(
    @Query('courseProgressId', ParseIntPipe) courseProgressId: number,
    @User('sub') sub: string,
  ) {
    return this.lectureProgressService.getAll(courseProgressId, sub);
  }

  @Post()
  @Roles(UserRoles.USER)
  @ApiOperation({
    summary: 'Mark a lecture as viewed/completed',
    description:
      'Logs a new lecture completion entry or updates progress tracking benchmarks inside the course schema for the authenticated student.',
  })
  @ApiBody({ type: CreateLectureProgressDto })
  @ApiCreatedResponse({
    description: 'Lecture progress ledger node created/updated successfully.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 501 },
        lectureId: { type: 'number', example: 88 },
        courseProgressId: { type: 'number', example: 1 },
        isCompleted: { type: 'boolean', example: true },
        userId: { type: 'string', example: 'asd12-wdsds-asd45' },
        viewDate: {
          type: 'string',
          format: 'date-time',
          example: '2026-07-12T21:21:00Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Incoming payload validation rules failed syntax verification.',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or expired authorization bearer token.',
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden resource. Action unauthorized for this entity profile.',
  })
  @ApiNotFoundResponse({
    description:
      'The targeted lecture or parent course progress context item could not be found.',
  })
  public create(
    @Body() createLectureProgressDto: CreateLectureProgressDto,
    @User('sub') sub: string,
  ) {
    return this.lectureProgressService.create(createLectureProgressDto, sub);
  }
}
