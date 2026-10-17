import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { StudentCoursesService } from './student-courses.service';
import { StudentCourse } from '../student-courses.entity';
import { UsersService } from 'src/users/providers/users.service';
import { CoursesService } from 'src/courses/providers/courses.service';
import { PaginationService } from 'src/common/pagination/providers/pagination.service';

describe('StudentCoursesService', () => {
  let service: StudentCoursesService;

  const repository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const usersService = {
    findOneById: jest.fn(),
  };

  const coursesService = {
    getCourse: jest.fn(),
  };

  const paginationService = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentCoursesService,
        {
          provide: getRepositoryToken(StudentCourse),
          useValue: repository,
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: CoursesService,
          useValue: coursesService,
        },
        {
          provide: PaginationService,
          useValue: paginationService,
        },
      ],
    }).compile();

    service = module.get<StudentCoursesService>(StudentCoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = {
      courseId: 1,
    };

    const student = {
      id: 'user-id',
    };

    const course = {
      id: 1,
    };

    it('should create a student course', async () => {
      jest.spyOn(service, 'findOneByUserAndCourse').mockResolvedValue(null);

      usersService.findOneById.mockResolvedValue(student);
      coursesService.getCourse.mockResolvedValue(course);

      const entity = {
        student,
        course,
        dateOfPurchase: new Date(),
      };

      repository.create.mockReturnValue(entity);
      repository.save.mockResolvedValue(entity);

      const result = await service.create(dto, 'user-id');

      expect(usersService.findOneById).toHaveBeenCalledWith({
        userId: 'user-id',
      });

      expect(coursesService.getCourse).toHaveBeenCalledWith(1);

      expect(repository.create).toHaveBeenCalledTimes(1);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          student,
          course,
        }),
      );

      expect(repository.save).toHaveBeenCalledWith(entity);

      expect(result).toEqual(entity);
    });

    it('should throw when course already purchased', async () => {
      jest
        .spyOn(service, 'findOneByUserAndCourse')
        .mockResolvedValue({} as StudentCourse);

      await expect(service.create(dto, 'user-id')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should use transaction repository', async () => {
      jest.spyOn(service, 'findOneByUserAndCourse').mockResolvedValue(null);

      usersService.findOneById.mockResolvedValue(student);
      coursesService.getCourse.mockResolvedValue(course);

      const entity = {
        student,
        course,
        dateOfPurchase: new Date(),
      };

      const transactionRepo = {
        create: jest.fn().mockReturnValue(entity),
        save: jest.fn().mockResolvedValue(entity),
      };

      const getRepository = jest.fn().mockReturnValue(transactionRepo);

      const manager = {
        getRepository,
      } as unknown as EntityManager;

      const result = await service.create(dto, 'user-id', manager);

      expect(getRepository).toHaveBeenCalledWith(StudentCourse);

      expect(transactionRepo.create).toHaveBeenCalled();

      expect(transactionRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          student,
          course,
        }),
      );
      expect(transactionRepo.save).toHaveBeenCalledWith(entity);

      expect(result).toEqual(entity);
    });
  });

  describe('findAll', () => {
    it('should paginate student courses', async () => {
      paginationService.paginate.mockResolvedValue('result');

      const dto = {
        page: 2,
        limit: 5,
      };

      const result = await service.findAll(dto, 'user-id');

      expect(paginationService.paginate).toHaveBeenCalledWith(
        {
          page: 2,
          limit: 5,
        },
        repository,
        {
          where: {
            student: {
              id: 'user-id',
            },
          },
        },
        {
          course: true,
        },
      );

      expect(result).toBe('result');
    });
  });

  describe('findOneById', () => {
    it('should return student course', async () => {
      const studentCourse = {} as StudentCourse;

      jest
        .spyOn(service, 'findOneByUserAndCourse')
        .mockResolvedValue(studentCourse);

      const result = await service.findOneById(1, 'user-id');

      expect(result).toBe(studentCourse);
    });

    it('should throw when course not found', async () => {
      jest.spyOn(service, 'findOneByUserAndCourse').mockResolvedValue(null);

      await expect(service.findOneById(1, 'user-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('findOneByUserAndCourse', () => {
    it('should query repository', async () => {
      const studentCourse = {} as StudentCourse;

      repository.findOne.mockResolvedValue(studentCourse);

      const result = await service.findOneByUserAndCourse(
        { courseId: 1 },
        'user-id',
        {
          course: true,
        },
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          student: {
            id: 'user-id',
          },
          course: {
            id: 1,
          },
        },
        relations: {
          course: true,
        },
      });

      expect(result).toBe(studentCourse);
    });

    it('should use transaction repository', async () => {
      const studentCourse = {} as StudentCourse;

      const transactionRepo = {
        findOne: jest.fn().mockResolvedValue(studentCourse),
      };

      const getRepository = jest.fn().mockReturnValue(transactionRepo);

      const manager = {
        getRepository,
      } as unknown as EntityManager;

      const result = await service.findOneByUserAndCourse(
        { courseId: 1 },
        'user-id',
        {},
        manager,
      );

      expect(getRepository).toHaveBeenCalledWith(StudentCourse);

      expect(transactionRepo.findOne).toHaveBeenCalledWith({
        where: {
          student: {
            id: 'user-id',
          },
          course: {
            id: 1,
          },
        },
        relations: {},
      });

      expect(result).toBe(studentCourse);
    });
  });
});
