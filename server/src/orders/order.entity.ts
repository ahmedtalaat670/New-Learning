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
import { OrderStatus } from './enums/order-status.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['user', 'course'])
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'userId' })
  @Exclude()
  user!: User;

  @ManyToOne(() => Course, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'courseId' })
  @Exclude()
  course!: Course;

  @Column({
    type: 'varchar',
    length: 96,
  })
  userName!: string;

  @Column({
    type: 'varchar',
    length: 150,
  })
  userEmail!: string;

  @Column({
    type: 'varchar',
    length: 96,
  })
  courseTitle!: string;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  courseImage?: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  coursePricing!: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    nullable: false,
  })
  orderStatus!: OrderStatus;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'paypal',
  })
  paymentMethod!: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
    nullable: false,
  })
  paymentStatus!: PaymentStatus;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  paymentId?: string;

  @CreateDateColumn()
  orderDate!: Date;
}
