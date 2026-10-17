import { Test, TestingModule } from '@nestjs/testing';

import { LectureProgressController } from './lecture-progress.controller';
import { LectureProgressService } from './providers/lecture-progress.service';

describe('LectureProgressController', () => {
  let controller: LectureProgressController;

  const lectureProgressService = {
    getAll: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LectureProgressController],
      providers: [
        {
          provide: LectureProgressService,
          useValue: lectureProgressService,
        },
      ],
    }).compile();

    controller = module.get<LectureProgressController>(
      LectureProgressController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return lecture progress records', async () => {
      const lectureProgress = [
        {
          id: 1,
          lecture: {
            id: 10,
            title: 'Introduction',
          },
          userId: 'user-id',
          viewDate: new Date(),
        },
      ];

      lectureProgressService.getAll.mockResolvedValue(lectureProgress);

      const result = await controller.findAll(5, 'user-id');

      expect(lectureProgressService.getAll).toHaveBeenCalledTimes(1);
      expect(lectureProgressService.getAll).toHaveBeenCalledWith(5, 'user-id');

      expect(result).toBe(lectureProgress);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Database error');

      lectureProgressService.getAll.mockRejectedValue(error);

      await expect(controller.findAll(5, 'user-id')).rejects.toThrow(error);

      expect(lectureProgressService.getAll).toHaveBeenCalledWith(5, 'user-id');
    });
  });

  describe('create', () => {
    it('should create lecture progress', async () => {
      const dto = {
        courseProgressId: 1,
        lectureId: 12,
      };

      const response = {
        id: 1,
        courseProgressId: 1,
        lectureId: 12,
        userId: 'user-id',
        viewDate: new Date(),
      };

      lectureProgressService.create.mockResolvedValue(response);

      const result = await controller.create(dto, 'user-id');

      expect(lectureProgressService.create).toHaveBeenCalledTimes(1);
      expect(lectureProgressService.create).toHaveBeenCalledWith(
        dto,
        'user-id',
      );

      expect(result).toBe(response);
    });

    it('should propagate service errors', async () => {
      const dto = {
        courseProgressId: 1,
        lectureId: 12,
      };

      const error = new Error('Failed');

      lectureProgressService.create.mockRejectedValue(error);

      await expect(controller.create(dto, 'user-id')).rejects.toThrow(error);

      expect(lectureProgressService.create).toHaveBeenCalledWith(
        dto,
        'user-id',
      );
    });
  });
});
