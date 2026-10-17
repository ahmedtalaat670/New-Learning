import type { ConfigType } from '@nestjs/config';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { fileTypes } from '../enums/file-types.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from '../upload.entity';
import { Repository } from 'typeorm';
import awsConfig from '../config/aws.config';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  constructor(
    private readonly uploadToAwsProvider: UploadToAwsProvider,

    @Inject(awsConfig.KEY)
    private readonly awsConfiguration: ConfigType<typeof awsConfig>,

    @InjectRepository(Upload)
    private readonly uploadsRepository: Repository<Upload>,
  ) {}

  public async uploadImage(file: Express.Multer.File): Promise<Upload> {
    const allowedMimeTypes = [
      'image/gif',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Image MIME type not supported');
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new BadRequestException('Image size exceeds 5 MB');
    }

    return this.handleFileUpload(file, fileTypes.IMAGE);
  }

  public async uploadVideo(file: Express.Multer.File): Promise<Upload> {
    const allowedMimeTypes = [
      'video/mp4',
      'video/mpeg',
      'video/webm',
      'video/quicktime',
    ];

    const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Video MIME type not supported');
    }

    if (file.size > MAX_VIDEO_SIZE) {
      throw new BadRequestException('Video size exceeds 50 MB');
    }

    return this.handleFileUpload(file, fileTypes.VIDEO);
  }

  private async handleFileUpload(
    file: Express.Multer.File,
    type: fileTypes,
  ): Promise<Upload> {
    try {
      const path = await this.uploadToAwsProvider.fileUpload(file);

      const bucketName = this.awsConfiguration.awsBucketName;
      const region = this.awsConfiguration.awsRegion;

      const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${path}`;

      const uploadFileData: Partial<Upload> = {
        name: file.originalname,
        path: s3Url,
        type: type,
        mime: file.mimetype,
        size: file.size,
      };

      const upload = this.uploadsRepository.create(uploadFileData);
      return await this.uploadsRepository.save(upload);
    } catch (error) {
      this.logger.error(
        `Upload File Error: ${error instanceof Error ? error.message : error}`,
      );

      throw new InternalServerErrorException(
        'Failed to process and upload the file',
      );
    }
  }

  public async deleteUpload(id: string): Promise<{ message: string }> {
    const upload = await this.uploadsRepository.findOneBy({ id });
    if (!upload) {
      throw new NotFoundException(`Upload record with ID ${id} not found`);
    }

    try {
      const bucketUrlPrefix = `https://${this.awsConfiguration.awsBucketName}.s3.${this.awsConfiguration.awsRegion}.amazonaws.com/`;
      const s3Key = upload.path.replace(bucketUrlPrefix, '');

      await this.uploadToAwsProvider.deleteFile(s3Key);

      await this.uploadsRepository.remove(upload);

      return { message: 'File and database record successfully deleted' };
    } catch (error) {
      this.logger.error(
        `Delete Process Error: ${error instanceof Error ? error.message : error}`,
      );
      throw new InternalServerErrorException(
        'Failed to complete file deletion sequence',
      );
    }
  }
}
