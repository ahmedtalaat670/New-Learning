import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentCourse } from './student-courses.entity';
import { StudentCoursesService } from './providers/student-courses.service';
import { StudentCoursesController } from './student-courses.controller';
import { UsersModule } from 'src/users/users.module';
import { CoursesModule } from 'src/courses/courses.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentCourse]),
    UsersModule,
    CoursesModule,
    PaginationModule,
  ],
  providers: [StudentCoursesService],
  controllers: [StudentCoursesController],
  exports: [StudentCoursesService],
})
export class StudentCoursesModule {}
