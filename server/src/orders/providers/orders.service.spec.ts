import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from '../order.entity';
import { UsersService } from 'src/users/providers/users.service';
import { CoursesService } from 'src/courses/providers/courses.service';
import { PaymentStatus } from '../enums/payment-status.enum';
import { OrderStatus } from '../enums/order-status.enum';
import { User } from 'src/users/user.entity';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: Repository<Order>;
  let usersService: UsersService;
  let coursesService: CoursesService;

  const mockOrdersRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUsersService = {
    findOneById: jest.fn(),
  };

  const mockCoursesService = {
    getCourse: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrdersRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    usersService = module.get<UsersService>(UsersService);
    coursesService = module.get<CoursesService>(CoursesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const userId = 'user-123';
    const courseId = 456;

    const mockUser = {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
    } as User;

    const mockCourse = {
      id: courseId,
      title: 'Awesome NestJS Course',
      image: 'course-image.png',
      pricing: 99.99,
    } as unknown as Awaited<ReturnType<CoursesService['getCourse']>>;

    it('should throw BadRequestException if the course does not exist', async () => {
      const findUserSpy = jest
        .spyOn(usersService, 'findOneById')
        .mockResolvedValue(mockUser);

      const getCourseSpy = jest
        .spyOn(coursesService, 'getCourse')
        .mockResolvedValue(
          null as unknown as Awaited<ReturnType<CoursesService['getCourse']>>,
        );

      await expect(service.create(courseId, userId)).rejects.toThrow(
        BadRequestException,
      );

      expect(findUserSpy).toHaveBeenCalledWith({ userId });
      expect(getCourseSpy).toHaveBeenCalledWith(courseId);
    });

    it('should return existing order details if an UNPAID order already exists', async () => {
      jest.spyOn(usersService, 'findOneById').mockResolvedValue(mockUser);
      jest.spyOn(coursesService, 'getCourse').mockResolvedValue(mockCourse);

      const mockExistingOrder = {
        id: 789,
        paymentStatus: PaymentStatus.UNPAID,
        orderStatus: OrderStatus.PENDING,
      } as Order;

      const repoFindSpy = jest
        .spyOn(ordersRepository, 'findOne')
        .mockResolvedValue(mockExistingOrder);

      const result = await service.create(courseId, userId);

      expect(repoFindSpy).toHaveBeenCalledWith({
        where: {
          user: { id: userId },
          course: { id: courseId },
        },
      });
      expect(result).toEqual({
        orderId: 789,
        userId: mockUser.id,
        courseId: courseId,
        orderStatus: OrderStatus.PENDING,
      });
    });

    it('should throw BadRequestException if a PAID order already exists', async () => {
      jest.spyOn(usersService, 'findOneById').mockResolvedValue(mockUser);
      jest.spyOn(coursesService, 'getCourse').mockResolvedValue(mockCourse);

      const mockExistingOrder = {
        id: 789,
        paymentStatus: PaymentStatus.PAID,
      } as Order;

      jest
        .spyOn(ordersRepository, 'findOne')
        .mockResolvedValue(mockExistingOrder);

      await expect(service.create(courseId, userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should successfully create and save a new order if no previous order is found', async () => {
      jest.spyOn(usersService, 'findOneById').mockResolvedValue(mockUser);
      jest.spyOn(coursesService, 'getCourse').mockResolvedValue(mockCourse);

      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(null);

      const mockNewOrder = {
        id: 999,
        orderStatus: OrderStatus.PENDING,
      } as Order;

      const createSpy = jest
        .spyOn(ordersRepository, 'create')
        .mockReturnValue(mockNewOrder);

      const saveSpy = jest
        .spyOn(ordersRepository, 'save')
        .mockResolvedValue(mockNewOrder);

      const result = await service.create(courseId, userId);

      expect(createSpy).toHaveBeenCalledWith({
        user: mockUser,
        course: mockCourse,
        userName: mockUser.name,
        userEmail: mockUser.email,
        courseTitle: 'Awesome NestJS Course',
        courseImage: 'course-image.png',
        coursePricing: 99.99,
        paymentMethod: 'paypal',
      });
      expect(saveSpy).toHaveBeenCalledWith(mockNewOrder);
      expect(result).toEqual({
        orderId: 999,
        userId: mockUser.id,
        courseId: courseId,
        orderStatus: OrderStatus.PENDING,
      });
    });
  });

  describe('findOne', () => {
    it('should return the order if found by ID', async () => {
      const mockOrder = { id: 123 } as Order;
      const findSpy = jest
        .spyOn(ordersRepository, 'findOne')
        .mockResolvedValue(mockOrder);

      const result = await service.findOne(123);

      expect(findSpy).toHaveBeenCalledWith({ where: { id: 123 } });
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException if no order matches the ID', async () => {
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
