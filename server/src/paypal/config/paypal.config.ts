import { registerAs } from '@nestjs/config';

export default registerAs('paypal', () => {
  const mode = process.env.PAYPAL_MODE || 'sandbox';
  const baseUrl =
    mode === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

  return {
    mode,
    baseUrl,
    clientId: process.env.PAYPAL_CLIENT_ID,
    secret: process.env.PAYPAL_SECRET,
  };
});
