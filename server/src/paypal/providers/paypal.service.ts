import {
  Inject,
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import paypalConfig from '../config/paypal.config';
import { PaymentStatus } from 'src/orders/enums/payment-status.enum';
import { OrderStatus } from 'src/orders/enums/order-status.enum';
import { CapturePaypalOrderDto } from '../dtos/capture-paypal-order.dto';
import { PaypalCaptureResponse } from '../interfaces/paypal-capture-response.interface';
import { Order } from 'src/orders/order.entity';
import { StudentCoursesService } from 'src/student-courses/providers/student-courses.service';
import { PaypalWebhookPayload } from '../interfaces/paypal-webhook-payload.interface';

@Injectable()
export class PaypalService {
  private readonly logger = new Logger(PaypalService.name);

  constructor(
    @Inject(paypalConfig.KEY)
    private readonly paypalConfiguration: ConfigType<typeof paypalConfig>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    private readonly studentCoursesService: StudentCoursesService,
  ) {}

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${this.paypalConfiguration.clientId}:${this.paypalConfiguration.secret}`,
    ).toString('base64');

    try {
      const response = await fetch(
        `${this.paypalConfiguration.baseUrl}/v1/oauth2/token`,
        {
          method: 'POST',
          body: 'grant_type=client_credentials',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `PayPal Order Creation responded with status ${response.status}: ${errorText}`,
        );
      }

      const data = (await response.json()) as { access_token: string };
      return data.access_token;
    } catch (error) {
      this.logger.error(
        `PayPal Authentication Failed: ${error instanceof Error ? error.message : error}`,
      );
      throw new InternalServerErrorException(
        'Failed to authenticate with PayPal APIs',
      );
    }
  }

  public async createPaypalOrder(orderId: number): Promise<{ id: string }> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException(`Order #${orderId} could not be located`);
    }
    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('you already bought this course');
    }

    const accessToken = await this.getAccessToken();

    try {
      const response = await fetch(
        `${this.paypalConfiguration.baseUrl}/v2/checkout/orders`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'PayPal-Request-Id': `order-create-${orderId}`,
          },
          body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
              {
                reference_id: order.id.toString(),
                amount: {
                  currency_code: 'USD',
                  value: Number(order.coursePricing).toFixed(2),
                },
                description: order.courseTitle,
              },
            ],
          }),
        },
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `PayPal Order Creation responded with status ${response.status}: ${errorText}`,
        );
      }
      const paypalOrder = (await response.json()) as { id: string };
      return { id: paypalOrder.id };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(
        `PayPal Order Creation Failed: ${error instanceof Error ? error.message : error}`,
      );
      throw new InternalServerErrorException(
        'Failed to initialize PayPal intent tracker',
      );
    }
  }

  public async capturePaypalOrder(
    dto: CapturePaypalOrderDto,
  ): Promise<{ status: string; orderId: number }> {
    const preliminaryOrder = await this.orderRepository.findOne({
      where: { id: dto.orderId },
    });
    if (!preliminaryOrder) {
      throw new NotFoundException(`Local Order #${dto.orderId} does not exist`);
    }
    if (preliminaryOrder.paymentStatus === PaymentStatus.PAID) {
      return { status: 'success', orderId: preliminaryOrder.id };
    }

    const accessToken = await this.getAccessToken();

    let captureData: PaypalCaptureResponse;
    try {
      const response = await fetch(
        `${this.paypalConfiguration.baseUrl}/v2/checkout/orders/${dto.paypalOrderId}/capture`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'PayPal-Request-Id': `order-capture-${dto.orderId}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `PayPal Order Capture responded with status ${response.status}: ${errorText}`,
        );
      }

      captureData = (await response.json()) as PaypalCaptureResponse;
    } catch (error) {
      this.logger.error(
        `PayPal Capture Execution Failure: ${error instanceof Error ? error.message : error}`,
      );
      throw new InternalServerErrorException(
        'Processing transaction clearance with PayPal failed',
      );
    }

    if (captureData.status !== 'COMPLETED') {
      throw new BadRequestException(
        'PayPal payment was authorization-cleared but not successfully captured',
      );
    }

    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];
    if (!capture || !capture.amount?.value || !capture.id) {
      this.logger.error(
        `PayPal structural parsing error on Order #${preliminaryOrder.id}. Response layout missing subproperties.`,
      );
      throw new BadRequestException(
        'Transaction structured payload is invalid.',
      );
    }

    try {
      return await this.orderRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const order = await transactionalEntityManager.findOne(Order, {
            where: { id: dto.orderId },
            lock: { mode: 'pessimistic_write' },
            relations: { course: true, user: true },
          });

          if (!order) {
            throw new NotFoundException(
              `Local Order #${dto.orderId} does not exist`,
            );
          }

          if (order.paymentStatus === PaymentStatus.PAID) {
            this.logger.log(
              `Order #${dto.orderId} already marked as paid by concurrent process.`,
            );
            return { status: 'success', orderId: order.id };
          }

          order.paymentStatus = PaymentStatus.PAID;
          order.orderStatus = OrderStatus.COMPLETED;
          order.paymentMethod = 'paypal';
          order.paymentId = capture.id;

          await transactionalEntityManager.save(order);

          await this.studentCoursesService.create(
            { courseId: order.course.id },
            order.user.id,
            transactionalEntityManager,
          );
          this.logger.log(
            `PayPal Order #${dto.orderId} successfully captured and verified.`,
          );

          return { status: 'success', orderId: order.id };
        },
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;

      const dbError = error as { code?: string; message?: string };

      if (
        dbError.code === '23505' ||
        dbError.message?.includes('unique constraint')
      ) {
        this.logger.warn(
          `Database Idempotency caught duplicate capture key insertion for Order #${dto.orderId}.`,
        );
        return { status: 'success', orderId: dto.orderId };
      }

      this.logger.error(
        `Database transaction error on Order #${dto.orderId}: ${error}`,
      );
      throw new InternalServerErrorException(
        'Failed to finalize payment state in database.',
      );
    }
  }
  public async handleWebhookApproval(
    payload: PaypalWebhookPayload,
  ): Promise<void> {
    const eventType = payload.event_type;

    if (eventType !== 'CHECKOUT.ORDER.APPROVED') {
      return;
    }

    const paypalOrderId = payload.resource.id;
    const localOrderId = Number(
      payload.resource.purchase_units?.[0]?.reference_id,
    );

    if (!localOrderId) {
      this.logger.error(
        `Webhook received without valid local reference_id for PayPal Order: ${paypalOrderId}`,
      );
      return;
    }

    this.logger.log(
      `Webhook fallback triggered for Order #${localOrderId}. Capturing transaction...`,
    );

    try {
      await this.capturePaypalOrder({
        orderId: localOrderId,
        paypalOrderId: paypalOrderId,
      });
    } catch (error) {
      this.logger.error(
        `Failed executing Webhook capture fallback for Order #${localOrderId}: ${error}`,
      );
      throw new BadRequestException('failed to execute the webhook');
    }
  }
}
