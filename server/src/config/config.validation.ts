import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('production', 'development', 'test', 'provision')
    .default('development'),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_BUCKET_NAME: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  PAYPAL_CLIENT_ID: Joi.string().required(),
  PAYPAL_SECRET: Joi.string().required(),
  PAYPAL_MODE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.string().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().required(),
});
