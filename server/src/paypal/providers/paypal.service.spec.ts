import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PaypalService } from './paypal.service';
import paypalConfig from '../config/paypal.config';
import { Order } from 'src/orders/order.entity';
import { StudentCoursesService } from 'src/student-courses/providers/student-courses.service';
import { PaymentStatus } from 'src/orders/enums/payment-status.enum';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import { CapturePaypalOrderDto } from '../dtos/capture-paypal-order.dto';
import { PaypalWebhookPayload } from '../interfaces/paypal-webhook-payload.interface';

describe('PaypalService', () => {
  let service: PaypalService;

  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  const mockPaypalConfig = {
    clientId: 'fake-client-id',
    secret: 'fake-client-secret',
    baseUrl: 'https://api-m.sandbox.paypal.com',
  };

  const mockOrderRepository = {
    findOne: jest.fn(),
    manager: {
      transaction: jest.fn(),
    },
  };

  const mockStudentCoursesService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaypalService,
        {
          provide: paypalConfig.KEY,
          useValue: mockPaypalConfig,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: StudentCoursesService,
          useValue: mockStudentCoursesService,
        },
      ],
    }).compile();

    service = module.get<PaypalService>(PaypalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const mockPaypalOauthSuccess = () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => ({ access_token: 'mock-access-token' }),
    });
  };

  describe('createPaypalOrder', () => {
    const orderId = 123;

    it('should throw NotFoundException if local order does not exist', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.createPaypalOrder(orderId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if order is already PAID', async () => {
      const existingOrder = {
        id: orderId,
        paymentStatus: PaymentStatus.PAID,
      } as Order;
      mockOrderRepository.findOne.mockResolvedValue(existingOrder);

      await expect(service.createPaypalOrder(orderId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should successfully call PayPal API and return an order id', async () => {
      const pendingOrder = {
        id: orderId,
        paymentStatus: PaymentStatus.UNPAID, // FIXED: Changed from PENDING to UNPAID
        coursePricing: 99.99,
        courseTitle: 'NestJS Masterclass',
      } as Order;

      mockOrderRepository.findOne.mockResolvedValue(pendingOrder);

      mockPaypalOauthSuccess();
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: () => ({ id: 'PAYPAL-ORDER-XYZ' }),
      });

      const result = await service.createPaypalOrder(orderId);

      expect(result).toEqual({ id: 'PAYPAL-ORDER-XYZ' });
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should throw InternalServerErrorException if OAuth API call fails', async () => {
      const pendingOrder = {
        id: orderId,
        paymentStatus: PaymentStatus.UNPAID,
      } as Order;
      mockOrderRepository.findOne.mockResolvedValue(pendingOrder);

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: () => 'Unauthorized client credentials',
      });

      await expect(service.createPaypalOrder(orderId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('capturePaypalOrder', () => {
    const captureDto: CapturePaypalOrderDto = {
      orderId: 123,
      paypalOrderId: 'PAYPAL-ORDER-XYZ',
    };

    it('should throw NotFoundException if initial local order search fails', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.capturePaypalOrder(captureDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should successfully execute the transaction, update status, and return success status', async () => {
      const mockOrder = {
        id: 123,
        paymentStatus: PaymentStatus.UNPAID,
        course: { id: 456 },
        user: { id: 789 },
      } as unknown as Order;

      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockPaypalOauthSuccess();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => ({
          status: 'COMPLETED',
          purchase_units: [
            {
              payments: {
                captures: [
                  {
                    id: 'CAPTURE-ID-999',
                    amount: { value: '99.99' },
                  },
                ],
              },
            },
          ],
        }),
      });

      const mockTxManager = {
        findOne: jest.fn().mockResolvedValue(mockOrder),
        save: jest.fn().mockResolvedValue(mockOrder),
      };

      mockOrderRepository.manager.transaction.mockImplementation(
        async (cb: (manager: EntityManager) => Promise<unknown>) => {
          return cb(mockTxManager as unknown as EntityManager);
        },
      );

      const result = await service.capturePaypalOrder(captureDto);

      expect(result).toEqual({ status: 'success', orderId: 123 });
      expect(mockTxManager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentStatus: PaymentStatus.PAID,
          orderStatus: OrderStatus.COMPLETED,
          paymentMethod: 'paypal',
          paymentId: 'CAPTURE-ID-999',
        }),
      );
      expect(mockStudentCoursesService.create).toHaveBeenCalledWith(
        { courseId: 456 },
        789,
        mockTxManager as unknown as EntityManager,
      );
    });

    it('should throw BadRequestException if PayPal capture status is not COMPLETED', async () => {
      const mockOrder = {
        id: 123,
        paymentStatus: PaymentStatus.UNPAID,
      } as Order;
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockPaypalOauthSuccess();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => ({ status: 'DENIED' }),
      });

      await expect(service.capturePaypalOrder(captureDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('handleWebhookApproval', () => {
    it('should skip processing if event type is not CHECKOUT.ORDER.APPROVED', async () => {
      const invalidPayload = {
        event_type: 'CHECKOUT.ORDER.COMPLETED',
      } as PaypalWebhookPayload;

      const spyCapture = jest.spyOn(service, 'capturePaypalOrder');

      await service.handleWebhookApproval(invalidPayload);

      expect(spyCapture).not.toHaveBeenCalled();
    });

    it('should trigger capture if webhook contains valid data', async () => {
      const payload: PaypalWebhookPayload = {
        event_type: 'CHECKOUT.ORDER.APPROVED',
        resource: {
          id: 'PAYPAL-ORDER-ABC',
          purchase_units: [
            {
              reference_id: '123',
            },
          ],
        },
      };

      const spyCapture = jest
        .spyOn(service, 'capturePaypalOrder')
        .mockResolvedValue({ status: 'success', orderId: 123 });

      await service.handleWebhookApproval(payload);

      expect(spyCapture).toHaveBeenCalledWith({
        orderId: 123,
        paypalOrderId: 'PAYPAL-ORDER-ABC',
      });
    });

    it('should handle redundant Webhook logs gracefully on BadRequestException', async () => {
      const payload: PaypalWebhookPayload = {
        event_type: 'CHECKOUT.ORDER.APPROVED',
        resource: {
          id: 'PAYPAL-ORDER-ABC',
          purchase_units: [{ reference_id: '123' }],
        },
      };

      jest
        .spyOn(service, 'capturePaypalOrder')
        .mockRejectedValue(new BadRequestException('Already paid'));

      await expect(
        service.handleWebhookApproval(payload),
      ).resolves.not.toThrow();
    });
  });
});
