import { Test, TestingModule } from '@nestjs/testing';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './providers/uploads.service';
import { fileTypes } from './enums/file-types.enum';

describe('UploadsController', () => {
  let controller: UploadsController;

  const uploadsService = {
    uploadImage: jest.fn(),
    uploadVideo: jest.fn(),
    deleteUpload: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadsController],
      providers: [
        {
          provide: UploadsService,
          useValue: uploadsService,
        },
      ],
    }).compile();

    controller = module.get<UploadsController>(UploadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should upload an image', async () => {
      const file = {
        originalname: 'image.png',
      } as Express.Multer.File;

      const upload = {
        id: '1',
        name: 'image.png',
        path: 'https://example.com/image.png',
        type: fileTypes.IMAGE,
        mime: 'image/png',
        size: 1024,
      };

      uploadsService.uploadImage.mockResolvedValue(upload);

      const result = await controller.uploadImage(file);

      expect(uploadsService.uploadImage).toHaveBeenCalledWith(file);
      expect(result).toEqual(upload);
    });
  });

  describe('uploadVideo', () => {
    it('should upload a video', async () => {
      const file = {
        originalname: 'video.mp4',
      } as Express.Multer.File;

      const upload = {
        id: '1',
        name: 'video.mp4',
        path: 'https://example.com/video.mp4',
        type: fileTypes.VIDEO,
        mime: 'video/mp4',
        size: 2048,
      };

      uploadsService.uploadVideo.mockResolvedValue(upload);

      const result = await controller.uploadVideo(file);

      expect(uploadsService.uploadVideo).toHaveBeenCalledWith(file);
      expect(result).toEqual(upload);
    });
  });

  describe('deleteUpload', () => {
    it('should delete an upload', async () => {
      uploadsService.deleteUpload.mockResolvedValue({
        message: 'File and database record successfully deleted',
      });

      const result = await controller.deleteUpload('1');

      expect(uploadsService.deleteUpload).toHaveBeenCalledWith('1');

      expect(result).toEqual({
        message: 'File and database record successfully deleted',
      });
    });
  });
});
