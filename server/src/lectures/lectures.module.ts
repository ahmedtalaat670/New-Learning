import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from './lecture.entity';
import { LecturesService } from './providers/lectures.service';
import { LecturesController } from './lectures.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture])],
  exports: [LecturesService],
  providers: [LecturesService],
  controllers: [LecturesController],
})
export class LecturesModule {}
