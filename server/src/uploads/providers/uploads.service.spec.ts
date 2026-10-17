import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UploadsService } from './uploads.service';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { Upload } from '../upload.entity';
import awsConfig from '../config/aws.config';
import { fileTypes } from '../enums/file-types.enum';

describe('UploadsService', () => {
  let service: UploadsService;

  const uploadProvider = {
    fileUpload: jest.fn(),
    deleteFile: jest.fn(),
  };

  type MockRepository = {
    create: jest.Mock;
    save: jest.Mock;
    findOneBy: jest.Mock;
    remove: jest.Mock;
  };

  const repository: MockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  const awsConfiguration = {
    awsBucketName: 'test-bucket',
    awsRegion: 'eu-central-1',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadsService,
        {
          provide: UploadToAwsProvider,
          useValue: uploadProvider,
        },
        {
          provide: getRepositoryToken(Upload),
          useValue: repository,
        },
        {
          provide: awsConfig.KEY,
          useValue: awsConfiguration,
        },
      ],
    }).compile();

    service = module.get<UploadsService>(UploadsService);
  });

  describe('uploadImage', () => {
    const image = {
      originalname: 'photo.png',
      mimetype: 'image/png',
      size: 1024,
    } as Express.Multer.File;

    it('should upload an image', async () => {
      uploadProvider.fileUpload.mockResolvedValue('uploads/photo.png');

      const entity: Upload = {
        id: '1',
        name: image.originalname,
        path: 'https://test-bucket.s3.eu-central-1.amazonaws.com/uploads/photo.png',
        type: fileTypes.IMAGE,
        mime: image.mimetype,
        size: image.size,
        createDate: new Date(),
        updateDate: new Date(),
      };

      repository.create.mockReturnValue(entity);
      repository.save.mockResolvedValue(entity);

      const result = await service.uploadImage(image);

      expect(uploadProvider.fileUpload).toHaveBeenCalledWith(image);

      expect(repository.create).toHaveBeenCalledWith({
        name: image.originalname,
        path: `https://${awsConfiguration.awsBucketName}.s3.${awsConfiguration.awsRegion}.amazonaws.com/uploads/photo.png`,
        type: fileTypes.IMAGE,
        mime: image.mimetype,
        size: image.size,
      });

      expect(repository.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual(entity);
    });

    it('should throw for unsupported mime type', async () => {
      const file = {
        mimetype: 'application/pdf',
        size: 100,
      } as Express.Multer.File;

      await expect(service.uploadImage(file)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should throw for oversized image', async () => {
      const file = {
        mimetype: 'image/png',
        size: 6 * 1024 * 1024,
      } as Express.Multer.File;

      await expect(service.uploadImage(file)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should throw when upload provider fails', async () => {
      uploadProvider.fileUpload.mockRejectedValue(new Error());

      await expect(service.uploadImage(image)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });

    it('should throw when repository save fails', async () => {
      uploadProvider.fileUpload.mockResolvedValue('uploads/photo.png');

      repository.create.mockReturnValue({});
      repository.save.mockRejectedValue(new Error());

      await expect(service.uploadImage(image)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });

  describe('uploadVideo', () => {
    const video = {
      originalname: 'video.mp4',
      mimetype: 'video/mp4',
      size: 1024,
    } as Express.Multer.File;

    it('should upload a video', async () => {
      uploadProvider.fileUpload.mockResolvedValue('uploads/video.mp4');

      repository.create.mockReturnValue({});
      repository.save.mockResolvedValue({ id: '1' });

      await service.uploadVideo(video);

      expect(uploadProvider.fileUpload).toHaveBeenCalledWith(video);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: fileTypes.VIDEO,
        }),
      );
    });

    it('should reject unsupported mime type', async () => {
      const file = {
        mimetype: 'image/png',
        size: 100,
      } as Express.Multer.File;

      await expect(service.uploadVideo(file)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should reject oversized video', async () => {
      const file = {
        mimetype: 'video/mp4',
        size: 60 * 1024 * 1024,
      } as Express.Multer.File;

      await expect(service.uploadVideo(file)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('deleteUpload', () => {
    const upload = {
      id: '1',
      path: `https://${awsConfiguration.awsBucketName}.s3.${awsConfiguration.awsRegion}.amazonaws.com/uploads/file.png`,
    };

    it('should delete upload', async () => {
      repository.findOneBy.mockResolvedValue(upload);
      uploadProvider.deleteFile.mockResolvedValue(undefined);
      repository.remove.mockResolvedValue(undefined);

      const result = await service.deleteUpload('1');

      expect(uploadProvider.deleteFile).toHaveBeenCalledWith(
        'uploads/file.png',
      );

      expect(repository.remove).toHaveBeenCalledWith(upload);

      expect(result).toEqual({
        message: 'File and database record successfully deleted',
      });
    });

    it('should throw if upload does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.deleteUpload('1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should throw if deleteFile fails', async () => {
      repository.findOneBy.mockResolvedValue(upload);
      uploadProvider.deleteFile.mockRejectedValue(new Error());

      await expect(service.deleteUpload('1')).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });

    it('should throw if repository remove fails', async () => {
      repository.findOneBy.mockResolvedValue(upload);
      uploadProvider.deleteFile.mockResolvedValue(undefined);
      repository.remove.mockRejectedValue(new Error());

      await expect(service.deleteUpload('1')).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
    });
  });
});
