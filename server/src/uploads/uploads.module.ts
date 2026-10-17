import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './providers/uploads.service';
import { UploadToAwsProvider } from './providers/upload-to-aws.provider';
import awsConfig from './config/aws.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './upload.entity';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, UploadToAwsProvider],
  imports: [
    ConfigModule.forFeature(awsConfig),
    TypeOrmModule.forFeature([Upload]),
  ],
})
export class UploadsModule {}
