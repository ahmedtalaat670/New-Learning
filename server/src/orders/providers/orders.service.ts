import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../order.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { CoursesService } from 'src/courses/providers/courses.service';
import { OrderResponse } from '../interfaces/order.interface';
import { PaymentStatus } from '../enums/payment-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly OrdersRepository: Repository<Order>,

    @Inject()
    private readonly usersService: UsersService,

    @Inject()
    private readonly coursesService: CoursesService,
  ) {}

  public async create(
    courseId: number,
    userId: string,
  ): Promise<OrderResponse> {
    const [user, course] = await Promise.all([
      this.usersService.findOneById({
        userId,
      }),
      this.coursesService.getCourse(courseId),
    ]);

    if (!course) {
      throw new BadRequestException('there is no course with this id');
    }
    const existingOrder = await this.OrdersRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        course: {
          id: courseId,
        },
      },
    });
    if (existingOrder?.paymentStatus === PaymentStatus.UNPAID) {
      return {
        orderId: existingOrder.id,
        userId: user.id,
        courseId: course.id,
        orderStatus: existingOrder.orderStatus,
      };
    }
    if (existingOrder?.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('you already bought this course');
    }
    const newOrder = this.OrdersRepository.create({
      user: user,
      course: course,
      userName: user.name,
      userEmail: user.email,
      courseTitle: course.title,
      courseImage: course.image,
      coursePricing: course.pricing,
      paymentMethod: 'paypal',
    });
    const savedOrder = await this.OrdersRepository.save(newOrder);
    return {
      orderId: savedOrder.id,
      userId: user.id,
      courseId: courseId,
      orderStatus: savedOrder.orderStatus,
    };
  }

  public async findOne(orderId: number) {
    const order = await this.OrdersRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('there is no course with this id');
    }
    return order;
  }
}
