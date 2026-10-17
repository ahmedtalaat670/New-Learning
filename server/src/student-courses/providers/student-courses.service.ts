import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentCourse } from '../student-courses.entity';
import { EntityManager, FindOptionsRelations, Repository } from 'typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { CoursesService } from 'src/courses/providers/courses.service';
import { CreateStudentCourseDto } from '../dtos/create-student-course.dto';
import { PaginationService } from 'src/common/pagination/providers/pagination.service';
import { GetStudentCoursesDto } from '../dtos/get-student-courses.dto';
import { getStudentCourseDto } from '../dtos/get-student-course.dto';

@Injectable()
export class StudentCoursesService {
  constructor(
    @InjectRepository(StudentCourse)
    private readonly studentCourseRepository: Repository<StudentCourse>,

    @Inject()
    private readonly usersService: UsersService,

    @Inject()
    private readonly coursesService: CoursesService,

    @Inject()
    private readonly paginationService: PaginationService,
  ) {}
  public async create(
    createStudentCourseDto: CreateStudentCourseDto,
    userId: string,
    manager?: EntityManager,
  ) {
    const repo = manager
      ? manager.getRepository(StudentCourse)
      : this.studentCourseRepository;
    const existingStudentCourse = await this.findOneByUserAndCourse(
      createStudentCourseDto,
      userId,
      {},
      manager,
    );
    if (existingStudentCourse) {
      throw new BadRequestException('this course is already bought');
    }

    const [student, course] = await Promise.all([
      this.usersService.findOneById({ userId }),
      this.coursesService.getCourse(createStudentCourseDto.courseId),
    ]);
    const studentCourse = repo.create({
      student,
      course,
      dateOfPurchase: new Date(),
    });
    return await repo.save(studentCourse);
  }

  public async findAll(
    getStudentCoursesDto: GetStudentCoursesDto,
    userId: string,
  ) {
    return await this.paginationService.paginate(
      {
        limit: getStudentCoursesDto.limit ?? 10,
        page: getStudentCoursesDto.page ?? 1,
      },
      this.studentCourseRepository,
      {
        where: {
          student: { id: userId },
        },
      },
      { course: true },
    );
  }

  public async findOneById(courseId: number, userId: string) {
    const studentCourse = await this.findOneByUserAndCourse(
      { courseId },
      userId,
      { course: true },
    );
    if (!studentCourse) {
      throw new NotFoundException(
        `you did not buy the course with id ${courseId}`,
      );
    }
    return studentCourse;
  }

  public async findOneByUserAndCourse(
    getStudentCourseDto: getStudentCourseDto,
    userId: string,
    relations?: FindOptionsRelations<StudentCourse>,
    manager?: EntityManager,
  ) {
    const repo = manager
      ? manager.getRepository(StudentCourse)
      : this.studentCourseRepository;
    const studentCourse = await repo.findOne({
      where: {
        student: { id: userId },
        course: { id: getStudentCourseDto.courseId },
      },
      relations: {
        ...(relations ? relations : {}),
      },
    });
    return studentCourse;
  }
}
