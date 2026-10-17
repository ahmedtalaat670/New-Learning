import { Exclude } from 'class-transformer';
import { Course } from 'src/courses/course.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Lecture {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  title!: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  freePreview!: boolean;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 512,
  })
  video!: string;

  @ManyToOne(() => Course, (course) => course.lectures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  @Exclude()
  course!: Course;

  @CreateDateColumn()
  @Exclude()
  createdAt!: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt!: Date;
}
