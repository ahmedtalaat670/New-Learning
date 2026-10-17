import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseProgress } from './course-progress.entity';
import { CourseProgressService } from './providers/course-progress.service';
import { UsersModule } from 'src/users/users.module';
import { CoursesModule } from 'src/courses/courses.module';
import { StudentCoursesModule } from 'src/student-courses/student-courses.module';
import { CourseProgressController } from './course-progress.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseProgress]),
    UsersModule,
    CoursesModule,
    StudentCoursesModule,
  ],
  providers: [CourseProgressService],
  controllers: [CourseProgressController],
  exports: [CourseProgressService],
})
export class CourseProgressModule {}
