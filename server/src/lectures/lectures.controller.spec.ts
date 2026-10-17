import { Test, TestingModule } from '@nestjs/testing';

import { LecturesController } from './lectures.controller';
import { LecturesService } from './providers/lectures.service';

describe('LecturesController', () => {
  let controller: LecturesController;

  const lecturesService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LecturesController],
      providers: [
        {
          provide: LecturesService,
          useValue: lecturesService,
        },
      ],
    }).compile();

    controller = module.get<LecturesController>(LecturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all lectures for a course', async () => {
      const lectures = [
        {
          id: 1,
          title: 'Introduction',
        },
        {
          id: 2,
          title: 'Getting Started',
        },
      ];

      lecturesService.findAll.mockResolvedValue(lectures);

      const result = await controller.findAll(12);

      expect(lecturesService.findAll).toHaveBeenCalledTimes(1);
      expect(lecturesService.findAll).toHaveBeenCalledWith(12);
      expect(result).toEqual(lectures);
    });

    it('should return an empty array when no lectures exist', async () => {
      lecturesService.findAll.mockResolvedValue([]);

      const result = await controller.findAll(12);

      expect(lecturesService.findAll).toHaveBeenCalledWith(12);
      expect(result).toEqual([]);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Database error');

      lecturesService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(12)).rejects.toThrow(error);

      expect(lecturesService.findAll).toHaveBeenCalledWith(12);
    });
  });
});
