export interface PaypalWebhookPayload {
  event_type: string;
  resource: {
    id: string;
    purchase_units?: Array<{
      reference_id?: string;
    }>;
  };
}
