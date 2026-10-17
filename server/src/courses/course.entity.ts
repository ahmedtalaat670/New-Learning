import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Lecture } from 'src/lectures/lecture.entity';
import { CourseCategoryEnum } from './enums/category.enum';
import { CourseLevelEnum } from './enums/level.enum';
import { CoursePrimaryLanguageEnum } from './enums/primary-language.enum';
import { Exclude } from 'class-transformer';

@Entity()
@Check(`"pricing" >= 0`)
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'instructorId' })
  @Exclude()
  instructor!: User;

  @Column({
    type: 'varchar',
    length: 96,
  })
  title!: string;

  @Column({
    type: 'enum',
    enum: CourseCategoryEnum,
    nullable: false,
  })
  category!: CourseCategoryEnum;

  @Column({
    type: 'enum',
    enum: CourseLevelEnum,
    nullable: false,
  })
  level!: CourseLevelEnum;

  @Column({
    type: 'enum',
    enum: CoursePrimaryLanguageEnum,
    nullable: false,
  })
  primaryLanguage!: CoursePrimaryLanguageEnum;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  subtitle!: string;

  @Column({
    type: 'text',
  })
  description!: string;

  @Column({
    type: 'decimal',
  })
  pricing!: number;

  @Column({
    type: 'text',
  })
  objectives!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  welcomeMessage?: string;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  image!: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isPublished!: boolean;

  @OneToMany(() => Lecture, (lecture) => lecture.course, {
    cascade: true,
  })
  @Exclude()
  lectures!: Lecture[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
