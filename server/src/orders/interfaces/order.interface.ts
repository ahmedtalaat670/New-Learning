import { OrderStatus } from '../enums/order-status.enum';

export interface OrderResponse {
  orderId: number;
  userId: string;
  courseId: number;
  orderStatus: OrderStatus;
}
