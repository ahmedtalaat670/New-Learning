import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCourseDto } from './dtos/create-course.dto';
import { CoursesService } from './providers/courses.service';
import { GetCoursesDto } from './dtos/get-courses.dto';
import { PatchCourseDto } from './dtos/patch-course.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/users/enums/user-roles.enum';
import { User } from 'src/auth/decorators/active-user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(UserRoles.INSTRUCTOR)
  @ApiOperation({
    summary: 'Create a new course',
    description: 'Allows authenticated instructors to create a new course.',
  })
  @ApiBody({ type: CreateCourseDto })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The course has been successfully created.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized access.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden resource. Only instructors can perform this action.',
  })
  public createCourse(
    @Body() createPostDto: CreateCourseDto,
    @User('sub') sub: string,
  ) {
    return this.coursesService.create(createPostDto, sub);
  }

  @Get()
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Get all courses',
    description:
      'Retrieve a paginated or filtered list of all courses. Publicly accessible.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of courses retrieved successfully.',
  })
  public getAllCourses(@Query() getCoursesDto: GetCoursesDto) {
    return this.coursesService.findAll(getCoursesDto);
  }

  @Get('instructor-courses')
  @Roles(UserRoles.INSTRUCTOR)
  @ApiOperation({
    summary: 'Get instructor-specific courses',
    description:
      'Retrieve all courses created by the currently authenticated instructor.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Instructor courses retrieved successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource. Only instructors can access this route.',
  })
  public getInstructorCourses(
    @Query() getCoursesDto: GetCoursesDto,
    @User('sub') sub: string,
  ) {
    return this.coursesService.findInstructorCourses(getCoursesDto, sub);
  }

  @Get(':id')
  @Auth(AuthType.None)
  @ApiOperation({
    summary: 'Get a course by ID',
    description:
      'Retrieve specific details of a course by its numeric ID. Publicly accessible.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique numeric identifier of the course',
  })
  @ApiResponse({
    status: 200,
    description: 'Course details retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  public getCourse(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.getCourse(id);
  }

  @Patch(':id')
  @Roles(UserRoles.INSTRUCTOR)
  @ApiOperation({
    summary: 'Update an existing course',
    description: 'Allows an instructor to update details of a course they own.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique numeric identifier of the course',
  })
  @ApiBody({ type: PatchCourseDto })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The course has been successfully updated.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden resource. Only instructors or the course owner can perform this action.',
  })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  public updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchCourseDto: PatchCourseDto,
    @User('sub') sub: string,
  ) {
    return this.coursesService.updateCourse(patchCourseDto, id, sub);
  }

  @Delete(':id')
  @Roles(UserRoles.INSTRUCTOR)
  @ApiOperation({
    summary: 'Delete a course',
    description: 'Allows an instructor to delete a course they own.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique numeric identifier of the course to be deleted',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The course has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  public deleteCourse(
    @Param('id', ParseIntPipe) id: number,
    @User('sub') sub: string,
  ) {
    return this.coursesService.deleteCourse(id, sub);
  }
}
