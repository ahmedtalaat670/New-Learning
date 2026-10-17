import { Test, TestingModule } from '@nestjs/testing';
import { PaypalController } from './paypal.controller';
import { PaypalService } from './providers/paypal.service';
import { CapturePaypalOrderDto } from './dtos/capture-paypal-order.dto';
import { PaypalWebhookPayload } from './interfaces/paypal-webhook-payload.interface';

describe('PaypalController', () => {
  let controller: PaypalController;
  let service: PaypalService;

  const mockPaypalService = {
    createPaypalOrder: jest.fn(),
    capturePaypalOrder: jest.fn(),
    handleWebhookApproval: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaypalController],
      providers: [
        {
          provide: PaypalService,
          useValue: mockPaypalService,
        },
      ],
    }).compile();

    controller = module.get<PaypalController>(PaypalController);
    service = module.get<PaypalService>(PaypalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should forward the orderId to paypalService.createPaypalOrder', async () => {
      const orderId = 123;
      const expectedResponse = { id: 'PAYPAL-ORDER-XYZ' };

      const createSpy = jest
        .spyOn(service, 'createPaypalOrder')
        .mockResolvedValue(expectedResponse);

      const result = await controller.createOrder(orderId);

      expect(createSpy).toHaveBeenCalledWith(orderId);
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('captureOrder', () => {
    it('should forward the DTO payload to paypalService.capturePaypalOrder', async () => {
      const dto: CapturePaypalOrderDto = {
        orderId: 123,
        paypalOrderId: 'PAYPAL-ORDER-XYZ',
      };
      const expectedResponse = { status: 'success', orderId: 123 };

      const captureSpy = jest
        .spyOn(service, 'capturePaypalOrder')
        .mockResolvedValue(expectedResponse);

      const result = await controller.captureOrder(dto);

      expect(captureSpy).toHaveBeenCalledWith(dto);
      expect(captureSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('handlePaypalWebhook', () => {
    const mockWebhookPayload = {
      event_type: 'CHECKOUT.ORDER.APPROVED',
      resource: {
        id: 'PAYPAL-ORDER-XYZ',
        purchase_units: [{ reference_id: '123' }],
      },
    } as PaypalWebhookPayload;

    it('should trigger handleWebhookApproval as fire-and-forget and return received: true immediately', async () => {
      const webhookSpy = jest
        .spyOn(service, 'handleWebhookApproval')
        .mockResolvedValue(undefined);

      const result = controller.handlePaypalWebhook(mockWebhookPayload);

      expect(webhookSpy).toHaveBeenCalledWith(mockWebhookPayload);
      expect(webhookSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ received: true });
    });
    it('should safely catch errors thrown inside handleWebhookApproval without interrupting webhook resolution', () => {
      const webhookSpy = jest
        .spyOn(service, 'handleWebhookApproval')
        .mockRejectedValue(new Error('Database Timeout'));

      expect(() => {
        const result = controller.handlePaypalWebhook(mockWebhookPayload);

        expect(result).toEqual({ received: true });
      }).not.toThrow();

      expect(webhookSpy).toHaveBeenCalledWith(mockWebhookPayload);
    });
  });
});
