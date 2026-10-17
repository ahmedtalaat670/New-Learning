import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from '../lecture.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LecturesService {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,
  ) {}

  public async findOne(id: number) {
    const lecture = await this.lectureRepository.findOne({
      where: { id },
      relations: { course: true },
    });
    if (!lecture) {
      throw new NotFoundException('there is no lecture with this id');
    }
    return lecture;
  }
  public async count(courseId: number) {
    return await this.lectureRepository.count({
      where: {
        course: { id: courseId },
      },
    });
  }
  public async findAll(courseId: number) {
    return await this.lectureRepository.find({
      where: {
        course: {
          id: courseId,
        },
      },
    });
  }
}
