import { Exclude } from 'class-transformer';
import { Course } from 'src/courses/course.entity';
import { LectureProgress } from 'src/lecture-progress/lecture-progress.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['user', 'course'])
export class CourseProgress {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  @Exclude()
  user!: User;

  @ManyToOne(() => Course, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  @Exclude()
  course!: Course;

  @Column({
    type: 'boolean',
    default: false,
  })
  completed!: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  completionDate?: Date;

  @OneToMany(() => LectureProgress, (progress) => progress.courseProgress, {
    cascade: true,
  })
  @Exclude()
  lecturesProgress!: LectureProgress[];

  @CreateDateColumn()
  createdAt!: Date;
}
