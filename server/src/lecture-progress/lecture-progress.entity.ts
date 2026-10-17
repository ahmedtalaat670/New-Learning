import { Exclude } from 'class-transformer';
import { CourseProgress } from 'src/course-progress/course-progress.entity';
import { Lecture } from 'src/lectures/lecture.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['courseProgress', 'lecture'])
export class LectureProgress {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CourseProgress, (progress) => progress.lecturesProgress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseProgressId' })
  courseProgress!: CourseProgress;

  @ManyToOne(() => Lecture, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lectureId' })
  lecture!: Lecture;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 512,
  })
  userId!: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  viewDate?: Date;
}
