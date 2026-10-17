import { PaypalPurchaseUnit } from './paypal-purcahse-unit.interface';

export interface PaypalCaptureResponse {
  status: 'COMPLETED' | 'SAVED' | 'APPROVED' | 'VOIDED';
  id: string;
  purchase_units: PaypalPurchaseUnit[];
}
