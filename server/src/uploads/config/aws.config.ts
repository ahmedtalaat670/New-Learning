import { registerAs } from '@nestjs/config';

export default registerAs('awsConfig', () => ({
  awsBucketName: process.env.AWS_BUCKET_NAME!,
  awsRegion: process.env.AWS_REGION!,
  awsAccessKey: process.env.AWS_ACCESS_KEY!,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
}));
