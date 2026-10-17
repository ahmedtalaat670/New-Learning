import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import awsConfig from '../config/aws.config';
import path from 'path';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadToAwsProvider {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(UploadToAwsProvider.name);

  constructor(
    @Inject(awsConfig.KEY)
    private readonly awsConfiguration: ConfigType<typeof awsConfig>,
  ) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.awsConfiguration.awsAccessKey,
        secretAccessKey: this.awsConfiguration.awsSecretAccessKey,
      },
      region: this.awsConfiguration.awsRegion,
    });
  }

  private getFileName(file: Express.Multer.File): string {
    const extension = path.extname(file.originalname);
    return `${randomUUID()}${extension}`;
  }

  public async fileUpload(file: Express.Multer.File): Promise<string> {
    const key = this.getFileName(file);

    try {
      const parallelUpload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.awsConfiguration.awsBucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ContentDisposition: 'inline',
        },
      });

      await parallelUpload.done();

      return key;
    } catch (error) {
      this.logger.error(
        `S3 Error: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new InternalServerErrorException('Failed to upload the file');
    }
  }

  public async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.awsConfiguration.awsBucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      this.logger.error(
        `AWS S3 Delete Failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw new InternalServerErrorException(
        'Failed to delete file from storage',
      );
    }
  }
}
