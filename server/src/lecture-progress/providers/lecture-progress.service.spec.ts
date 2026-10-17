import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LectureProgressService } from './lecture-progress.service';
import { LectureProgress } from '../lecture-progress.entity';
import { CourseProgress } from 'src/course-progress/course-progress.entity';
import { CourseProgressService } from 'src/course-progress/providers/course-progress.service';
import { LecturesService } from 'src/lectures/providers/lectures.service';

describe('LectureProgressService', () => {
  let service: LectureProgressService;

  const lectureProgressRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
    find: jest.fn(),
  } satisfies Partial<Repository<LectureProgress>>;

  const courseProgressRepository = {
    findOne: jest.fn(),
  } satisfies Partial<Repository<CourseProgress>>;

  const courseProgressService = {
    complete: jest.fn(),
  };

  const lecturesService = {
    findOne: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LectureProgressService,
        {
          provide: getRepositoryToken(LectureProgress),
          useValue: lectureProgressRepository,
        },
        {
          provide: getRepositoryToken(CourseProgress),
          useValue: courseProgressRepository,
        },
        {
          provide: CourseProgressService,
          useValue: courseProgressService,
        },
        {
          provide: LecturesService,
          useValue: lecturesService,
        },
      ],
    }).compile();

    service = module.get(LectureProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      courseProgressId: 1,
      lectureId: 5,
    };

    const courseProgress = {
      id: 1,
    } as CourseProgress;

    const lecture = {
      id: 5,
      course: {
        id: 10,
      },
    };

    it('should return existing lecture progress', async () => {
      const existing = {
        id: 100,
        courseProgress,
        lecture,
        userId: 'user-id',
        viewDate: new Date(),
      };

      lectureProgressRepository.findOne.mockResolvedValue(existing);

      const result = await service.create(dto, 'user-id');

      expect(result).toEqual({
        id: existing.id,
        courseProgressId: 1,
        lectureId: 5,
        userId: 'user-id',
        viewDate: existing.viewDate,
      });

      expect(lectureProgressRepository.save).not.toHaveBeenCalled();
    });

    it('should create lecture progress', async () => {
      lectureProgressRepository.findOne.mockResolvedValue(null);

      courseProgressRepository.findOne.mockResolvedValue(courseProgress);

      lecturesService.findOne.mockResolvedValue(lecture);

      const entity = {
        courseProgress,
        lecture,
        userId: 'user-id',
        viewDate: new Date(),
      };

      lectureProgressRepository.create.mockReturnValue(entity);

      lectureProgressRepository.save.mockResolvedValue({
        id: 1,
        ...entity,
      });

      lectureProgressRepository.count.mockResolvedValue(1);

      lecturesService.count.mockResolvedValue(5);

      const result = await service.create(dto, 'user-id');

      expect(courseProgressRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });

      expect(lecturesService.findOne).toHaveBeenCalledWith(5);

      expect(lectureProgressRepository.create).toHaveBeenCalled();

      expect(lectureProgressRepository.save).toHaveBeenCalledWith(entity);

      expect(result).toEqual({
        id: 1,
        courseProgressId: 1,
        lectureId: 5,
        userId: 'user-id',
        viewDate: entity.viewDate,
      });

      expect(courseProgressService.complete).not.toHaveBeenCalled();
    });

    it('should complete the course when all lectures are watched', async () => {
      lectureProgressRepository.findOne.mockResolvedValue(null);

      courseProgressRepository.findOne.mockResolvedValue(courseProgress);

      lecturesService.findOne.mockResolvedValue(lecture);

      const entity = {
        courseProgress,
        lecture,
        userId: 'user-id',
        viewDate: new Date(),
      };

      lectureProgressRepository.create.mockReturnValue(entity);

      lectureProgressRepository.save.mockResolvedValue({
        id: 1,
        ...entity,
      });

      lectureProgressRepository.count.mockResolvedValue(5);

      lecturesService.count.mockResolvedValue(5);

      await service.create(dto, 'user-id');

      expect(courseProgressService.complete).toHaveBeenCalledTimes(1);

      expect(courseProgressService.complete).toHaveBeenCalledWith(
        courseProgress,
      );
    });

    it('should throw when course progress does not exist', async () => {
      lectureProgressRepository.findOne.mockResolvedValue(null);

      courseProgressRepository.findOne.mockResolvedValue(null);

      lecturesService.findOne.mockResolvedValue(lecture);

      await expect(service.create(dto, 'user-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('getAll', () => {
    it('should return lecture progress list', async () => {
      const progress = [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ];

      lectureProgressRepository.find.mockResolvedValue(progress);

      const result = await service.getAll(1, 'user-id');

      expect(lectureProgressRepository.find).toHaveBeenCalledWith({
        where: {
          courseProgress: {
            id: 1,
          },
          userId: 'user-id',
        },
        relations: {
          lecture: true,
        },
      });

      expect(result).toEqual(progress);
    });

    it('should return an empty array', async () => {
      lectureProgressRepository.find.mockResolvedValue([]);

      const result = await service.getAll(1, 'user-id');

      expect(result).toEqual([]);
    });
  });
});
