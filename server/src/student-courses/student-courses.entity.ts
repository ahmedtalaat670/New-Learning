import { Exclude } from 'class-transformer';
import { Course } from 'src/courses/course.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['student', 'course'])
export class StudentCourse {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  @Exclude()
  student!: User;

  @ManyToOne(() => Course, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  course!: Course;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateOfPurchase!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
