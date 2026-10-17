import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseProgress } from '../course-progress.entity';
import { Repository } from 'typeorm';
import { CreateCourseProgressDto } from '../dtos/create-course-progress.dto';
import { UsersService } from 'src/users/providers/users.service';
import { CoursesService } from 'src/courses/providers/courses.service';
import { StudentCoursesService } from 'src/student-courses/providers/student-courses.service';

@Injectable()
export class CourseProgressService {
  constructor(
    @InjectRepository(CourseProgress)
    private readonly courseProgressRepository: Repository<CourseProgress>,

    @Inject()
    private readonly usersService: UsersService,

    @Inject()
    private readonly coursesService: CoursesService,

    @Inject()
    private readonly studentCoursesService: StudentCoursesService,
  ) {}

  public async create(
    createCourseProgressDto: CreateCourseProgressDto,
    userId: string,
  ) {
    await this.studentCoursesService.findOneById(
      createCourseProgressDto.courseId,
      userId,
    );

    const [user, course] = await Promise.all([
      this.usersService.findOneById({
        userId,
      }),
      this.coursesService.getCourse(createCourseProgressDto.courseId),
    ]);
    const courseProgress = this.courseProgressRepository.create({
      user,
      course,
      completed: false,
    });
    return await this.courseProgressRepository.save(courseProgress);
  }

  public async findOne(
    courseId: number,
    userId: string,
  ): Promise<CourseProgress> {
    const courseProgress = await this.courseProgressRepository.findOne({
      where: { course: { id: courseId }, user: { id: userId } },
    });
    if (!courseProgress) {
      const newCourseProgress = await this.create(
        {
          courseId,
        },
        userId,
      );
      return newCourseProgress;
    }
    return courseProgress;
  }

  public async delete(courseProgressId: number, userId: string) {
    const course = await this.courseProgressRepository.findOne({
      where: { id: courseProgressId },
      relations: { user: true },
    });
    if (!course) {
      throw new NotFoundException('there is no course with this id');
    }
    if (course.user.id !== userId) {
      throw new ForbiddenException('you are not allowed to update this course');
    }
    return await this.courseProgressRepository.delete({ id: courseProgressId });
  }

  public async complete(courseProgress: CourseProgress) {
    courseProgress.completed = true;
    courseProgress.completionDate = new Date();
    return await this.courseProgressRepository.save(courseProgress);
  }
}
