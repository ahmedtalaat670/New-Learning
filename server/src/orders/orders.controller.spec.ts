import { Test, TestingModule } from '@nestjs/testing';

import { OrdersController } from './orders.controller';
import { OrdersService } from './providers/orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;

  const ordersService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: ordersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const expectedResult = {
        id: 1,
        courseId: 5,
        userId: 'user-id',
      };

      ordersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(5, 'user-id');

      expect(ordersService.create).toHaveBeenCalledTimes(1);
      expect(ordersService.create).toHaveBeenCalledWith(5, 'user-id');
      expect(result).toEqual(expectedResult);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Creation failed');

      ordersService.create.mockRejectedValue(error);

      await expect(controller.create(5, 'user-id')).rejects.toThrow(error);

      expect(ordersService.create).toHaveBeenCalledWith(5, 'user-id');
    });
  });
});
