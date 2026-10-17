import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LecturesService } from './lectures.service';
import { Lecture } from '../lecture.entity';

describe('LecturesService', () => {
  let service: LecturesService;

  const repository = {
    findOne: jest.fn(),
    count: jest.fn(),
    find: jest.fn(),
  } satisfies Partial<Repository<Lecture>>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LecturesService,
        {
          provide: getRepositoryToken(Lecture),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<LecturesService>(LecturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return the lecture', async () => {
      const lecture = {
        id: 1,
      } as Lecture;

      repository.findOne.mockResolvedValue(lecture);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        relations: {
          course: true,
        },
      });

      expect(result).toBe(lecture);
    });

    it('should throw NotFoundException when lecture does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        relations: {
          course: true,
        },
      });
    });
  });

  describe('count', () => {
    it('should return lecture count', async () => {
      repository.count.mockResolvedValue(8);

      const result = await service.count(5);

      expect(repository.count).toHaveBeenCalledWith({
        where: {
          course: {
            id: 5,
          },
        },
      });

      expect(result).toBe(8);
    });
  });

  describe('findAll', () => {
    it('should return all lectures for a course', async () => {
      const lectures = [{ id: 1 } as Lecture, { id: 2 } as Lecture];

      repository.find.mockResolvedValue(lectures);

      const result = await service.findAll(10);

      expect(repository.find).toHaveBeenCalledWith({
        where: {
          course: {
            id: 10,
          },
        },
      });

      expect(result).toEqual(lectures);
    });

    it('should return an empty array when no lectures exist', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll(10);

      expect(repository.find).toHaveBeenCalledWith({
        where: {
          course: {
            id: 10,
          },
        },
      });

      expect(result).toEqual([]);
    });
  });
});
