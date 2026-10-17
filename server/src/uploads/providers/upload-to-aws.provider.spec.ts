import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import awsConfig from '../config/aws.config';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(),
  DeleteObjectCommand: jest.fn(),
}));

jest.mock('@aws-sdk/lib-storage', () => ({
  Upload: jest.fn(),
}));

describe('UploadToAwsProvider', () => {
  let provider: UploadToAwsProvider;
  const MockUpload = Upload as jest.MockedClass<typeof Upload>;

  const mockSend = jest.fn();

  const awsConfiguration = {
    awsAccessKey: 'access-key',
    awsSecretAccessKey: 'secret-key',
    awsRegion: 'eu-central-1',
    awsBucketName: 'test-bucket',
  };

  beforeEach(async () => {
    mockSend.mockReset();

    (S3Client as jest.Mock).mockImplementation(() => ({
      send: mockSend,
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadToAwsProvider,
        {
          provide: awsConfig.KEY,
          useValue: awsConfiguration,
        },
      ],
    }).compile();

    provider = module.get<UploadToAwsProvider>(UploadToAwsProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fileUpload', () => {
    const file = {
      originalname: 'image.png',
      mimetype: 'image/png',
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    it('should upload the file successfully', async () => {
      const done = jest.fn().mockResolvedValue(undefined);

      MockUpload.mockImplementation(
        () =>
          ({
            done,
          }) as unknown as Upload,
      );
      const key = await provider.fileUpload(file);

      expect(Upload).toHaveBeenCalledTimes(1);
      expect(done).toHaveBeenCalled();
      expect(typeof key).toBe('string');
      expect(key.endsWith('.png')).toBe(true);
    });

    it('should throw InternalServerErrorException when upload fails', async () => {
      const done = jest.fn().mockRejectedValue(new Error('Upload failed'));

      MockUpload.mockImplementation(
        () =>
          ({
            done,
          }) as unknown as Upload,
      );

      await expect(provider.fileUpload(file)).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );

      expect(done).toHaveBeenCalled();
    });
  });

  describe('deleteFile', () => {
    it('should delete a file successfully', async () => {
      mockSend.mockResolvedValue({});

      await expect(provider.deleteFile('file-key')).resolves.toBeUndefined();

      expect(DeleteObjectCommand).toHaveBeenCalledWith({
        Bucket: awsConfiguration.awsBucketName,
        Key: 'file-key',
      });

      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should throw InternalServerErrorException when delete fails', async () => {
      mockSend.mockRejectedValue(new Error('Delete failed'));

      await expect(provider.deleteFile('file-key')).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );

      expect(mockSend).toHaveBeenCalledTimes(1);
    });
  });
});
