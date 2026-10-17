import { PaypalCaptureItem } from './paypal-capture-item.interface';

export interface PaypalPurchaseUnit {
  payments: {
    captures: PaypalCaptureItem[];
  };
}
