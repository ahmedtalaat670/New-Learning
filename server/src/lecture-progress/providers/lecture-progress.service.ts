import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LectureProgress } from '../lecture-progress.entity';
import { Repository } from 'typeorm';
import { CreateLectureProgressDto } from '../dtos/create-lecture-progress.dto';
import { CourseProgressService } from 'src/course-progress/providers/course-progress.service';
import { LecturesService } from 'src/lectures/providers/lectures.service';
import { CourseProgress } from 'src/course-progress/course-progress.entity';

@Injectable()
export class LectureProgressService {
  constructor(
    @InjectRepository(LectureProgress)
    private readonly lectureProgressRepository: Repository<LectureProgress>,

    @Inject()
    private readonly courseProgressService: CourseProgressService,

    @Inject()
    private readonly lecturesService: LecturesService,

    @InjectRepository(CourseProgress)
    private readonly courseProgressRepository: Repository<CourseProgress>,
  ) {}

  public async create(
    createLectureProgressDto: CreateLectureProgressDto,
    userId: string,
  ) {
    const existing = await this.lectureProgressRepository.findOne({
      where: {
        courseProgress: { id: createLectureProgressDto.courseProgressId },
        lecture: { id: createLectureProgressDto.lectureId },
        userId,
      },
      relations: {
        lecture: true,
        courseProgress: true,
      },
    });
    if (existing) {
      return existing;
    }
    const [courseProgress, lecture] = await Promise.all([
      this.courseProgressRepository.findOne({
        where: { id: createLectureProgressDto.courseProgressId },
      }),
      this.lecturesService.findOne(createLectureProgressDto.lectureId),
    ]);
    if (!courseProgress)
      throw new NotFoundException('there is no course progress with this id');
    const lectureProgress = this.lectureProgressRepository.create({
      courseProgress,
      lecture,
      viewDate: new Date(),
      userId,
    });
    const savedLectureProgress =
      await this.lectureProgressRepository.save(lectureProgress);
    const [lectureProgressCount, lecturesCount] = await Promise.all([
      this.lectureProgressRepository.count({
        where: {
          courseProgress: { id: createLectureProgressDto.courseProgressId },
          userId,
        },
      }),
      this.lecturesService.count(lecture.course.id),
    ]);

    if (lecturesCount <= lectureProgressCount) {
      await this.courseProgressService.complete(courseProgress);
    }

    return savedLectureProgress;
  }

  public async getAll(courseProgressId: number, userId: string) {
    return await this.lectureProgressRepository.find({
      where: {
        userId,
        courseProgress: {
          id: courseProgressId,
        },
      },
      relations: {
        courseProgress: true,
        lecture: true,
      },
    });
  }
}
