import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { StudentCoursesService } from './providers/student-courses.service';
import { CreateStudentCourseDto } from './dtos/create-student-course.dto';
import { GetStudentCoursesDto } from './dtos/get-student-courses.dto';
import { User } from 'src/auth/decorators/active-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/users/enums/user-roles.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Student Courses')
@ApiBearerAuth()
@Controller('student-courses')
export class StudentCoursesController {
  constructor(
    @Inject()
    private readonly studentCoursesService: StudentCoursesService,
  ) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(UserRoles.INSTRUCTOR)
  @ApiOperation({
    summary: 'Enroll a student in a course',
    description:
      'Enrolls the currently authenticated student into a course using the provided payload info.',
  })
  @ApiBody({ type: CreateStudentCourseDto })
  @ApiResponse({
    status: 201,
    description: 'Student enrollment record generated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid payload constraints provided.',
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or expired authentication token.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden resource. User account authorization mismatch.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict error. Student is already enrolled in this course.',
  })
  public createStudentCourse(
    @Body() createStudentCourseDto: CreateStudentCourseDto,
    @User('sub') sub: string,
  ) {
    return this.studentCoursesService.create(createStudentCourseDto, sub);
  }

  @Get()
  @Roles(UserRoles.USER)
  @ApiOperation({
    summary: 'List my enrolled courses',
    description:
      'Fetches a filtered or paginated set of active course enrollments belonging to the logged-in student.',
  })
  @ApiResponse({
    status: 200,
    description: 'Enrolled courses collection fetched successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or expired authentication token.',
  })
  public getStudentCourses(
    @Query() getStudentCoursesDto: GetStudentCoursesDto,
    @User('sub') sub: string,
  ) {
    return this.studentCoursesService.findAll(getStudentCoursesDto, sub);
  }

  @Get(':id')
  @Roles(UserRoles.USER)
  @ApiOperation({
    summary: 'Get individual enrollment status details',
    description:
      'Looks up a specific enrollment context record using its unique database tracking ID number.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The numeric unique ID of the target enrollment entity',
  })
  @ApiResponse({
    status: 200,
    description: 'Target enrollment context item metadata found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Missing or expired authentication token.',
  })
  @ApiResponse({
    status: 404,
    description: 'Enrollment registry reference item not found.',
  })
  public getStudentCourse(
    @Param('id', ParseIntPipe) id: number,
    @User('sub') sub: string,
  ) {
    return this.studentCoursesService.findOneById(id, sub);
  }
}
