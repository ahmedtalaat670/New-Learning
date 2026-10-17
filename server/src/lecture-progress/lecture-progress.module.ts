import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureProgress } from './lecture-progress.entity';
import { LectureProgressController } from './lecture-progress.controller';
import { LectureProgressService } from './providers/lecture-progress.service';
import { CourseProgressModule } from 'src/course-progress/course-progress.module';
import { LecturesModule } from 'src/lectures/lectures.module';
import { CourseProgress } from 'src/course-progress/course-progress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LectureProgress, CourseProgress]),
    CourseProgressModule,
    LecturesModule,
  ],
  controllers: [LectureProgressController],
  providers: [LectureProgressService],
})
export class LectureProgressModule {}
