declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    MONGODB_URI: string;
    JWT_SECRET: string;
    NODEMAILER_HOST: string;
    NODEMAILER_USERNAME: string;
    NODEMAILER_PASSWORD: string;
  }
}
