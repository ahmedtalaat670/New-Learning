export interface PaypalCaptureItem {
  id: string;
  status: string;
  amount: {
    currency_code: string;
    value: string;
  };
}
