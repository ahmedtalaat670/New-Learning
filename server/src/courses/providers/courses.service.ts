import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../course.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { GetCoursesDto } from '../dtos/get-courses.dto';
import { PaginationService } from 'src/common/pagination/providers/pagination.service';
import { PatchCourseDto } from '../dtos/patch-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @Inject()
    private readonly usersService: UsersService,

    @Inject()
    private readonly paginationService: PaginationService,
  ) {}
  public async create(createCourseDto: CreateCourseDto, userId: string) {
    const instructor = await this.usersService.findOneById({
      userId,
    });

    const existingCourse = await this.courseRepository.findOne({
      where: {
        ...createCourseDto,
      },
    });
    if (existingCourse) {
      throw new ConflictException(
        'there is already course with this informations',
      );
    }
    const course = this.courseRepository.create({
      ...createCourseDto,
      instructor,
    });
    return await this.courseRepository.save(course);
  }

  public async findAll(getCoursesDto: GetCoursesDto) {
    return await this.paginationService.paginate(
      {
        limit: getCoursesDto.limit ?? 10,
        page: getCoursesDto.page ?? 1,
      },
      this.courseRepository,
    );
  }

  public async findInstructorCourses(
    getCoursesDto: GetCoursesDto,
    userId: string,
  ) {
    const instructor = await this.usersService.findOneById({
      userId,
    });
    return await this.paginationService.paginate(
      {
        limit: getCoursesDto.limit ?? 10,
        page: getCoursesDto.page ?? 1,
      },
      this.courseRepository,
      {
        where: {
          instructor: {
            id: instructor.id,
          },
        },
      },
    );
  }

  public async getCourse(id: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: {
        id,
      },
      relations: {
        lectures: true,
      },
    });
    if (!course) {
      throw new NotFoundException('there is no course with this id');
    }
    return course;
  }

  public async updateCourse(
    patchCourseDto: PatchCourseDto,
    id: number,
    userId: string,
  ) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: { instructor: true },
    });
    if (!course) {
      throw new NotFoundException('there is no course with this id');
    }
    if (course.instructor.id !== userId) {
      throw new UnauthorizedException(
        'you are not allowed to update this course',
      );
    }
    return await this.courseRepository.update({ id }, patchCourseDto);
  }

  public async deleteCourse(id: number, userId: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: { instructor: true },
    });
    if (!course) {
      throw new NotFoundException('there is no course with this id');
    }
    if (course.instructor.id !== userId) {
      throw new UnauthorizedException(
        'you are not allowed to update this course',
      );
    }
    return await this.courseRepository.delete({ id });
  }
}
