import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from '../course.entity';
import { UsersService } from 'src/users/providers/users.service';
import { PaginationService } from 'src/common/pagination/providers/pagination.service';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { GetCoursesDto } from '../dtos/get-courses.dto';
import { PatchCourseDto } from '../dtos/patch-course.dto';
import { User } from 'src/users/user.entity';

describe('CoursesService', () => {
  let service: CoursesService;
  let courseRepository: Repository<Course>;
  let usersService: UsersService;
  let paginationService: PaginationService;

  const mockCourseRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUsersService = {
    findOneById: jest.fn(),
  };

  const mockPaginationService = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockCourseRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    courseRepository = module.get<Repository<Course>>(
      getRepositoryToken(Course),
    );
    usersService = module.get<UsersService>(UsersService);
    paginationService = module.get<PaginationService>(PaginationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const userId = 'user-uuid-123';
    const createDto: CreateCourseDto = {
      title: 'Mastering NestJS',
      pricing: 49.99,
    } as CreateCourseDto;

    const mockInstructor = { id: userId, name: 'Instructor Name' } as User;
    const mockCreatedCourse = {
      id: 1,
      ...createDto,
      instructor: mockInstructor,
    } as Course;

    it('should throw ConflictException if a course already exists with the same details', async () => {
      jest.spyOn(usersService, 'findOneById').mockResolvedValue(mockInstructor);
      jest
        .spyOn(courseRepository, 'findOne')
        .mockResolvedValue(mockCreatedCourse);

      await expect(service.create(createDto, userId)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should successfully create and save a new course', async () => {
      jest.spyOn(usersService, 'findOneById').mockResolvedValue(mockInstructor);

      jest.spyOn(courseRepository, 'findOne').mockResolvedValue(null);

      const createSpy = jest
        .spyOn(courseRepository, 'create')
        .mockReturnValue(mockCreatedCourse);
      const saveSpy = jest
        .spyOn(courseRepository, 'save')
        .mockResolvedValue(mockCreatedCourse);

      const result = await service.create(createDto, userId);

      expect(createSpy).toHaveBeenCalledWith({
        ...createDto,
        instructor: mockInstructor,
      });
      expect(saveSpy).toHaveBeenCalledWith(mockCreatedCourse);
      expect(result).toEqual(mockCreatedCourse);
    });
  });

  describe('findAll', () => {
    it('should call paginationService with defaults when getCoursesDto is empty', async () => {
      const dto: GetCoursesDto = {};

      // Structure your mocked return to match your Paginated interface requirements precisely
      const mockPaginatedResult = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 0,
          currentPage: 1,
          totalPages: 0,
        },
        links: {
          first: '',
          previous: '',
          current: '', // Added current property here
          next: '',
          last: '',
        },
      };

      const paginateSpy = jest
        .spyOn(paginationService, 'paginate')
        .mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(dto);

      expect(paginateSpy).toHaveBeenCalledWith(
        { limit: 10, page: 1 },
        courseRepository,
      );
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('findInstructorCourses', () => {
    const userId = 'instructor-id-123';
    const mockInstructor = { id: userId } as User;

    it('should find instructor first, then paginate course repository using instructor filter', async () => {
      const dto: GetCoursesDto = { limit: 5, page: 2 };

      const mockPaginatedResult = {
        data: [],
        meta: {
          itemsPerPage: 5,
          totalItems: 0,
          currentPage: 2,
          totalPages: 0,
        },
        links: {
          first: '',
          previous: '',
          current: '',
          next: '',
          last: '',
        },
      };

      const findUserSpy = jest
        .spyOn(usersService, 'findOneById')
        .mockResolvedValue(mockInstructor);
      const paginateSpy = jest
        .spyOn(paginationService, 'paginate')
        .mockResolvedValue(mockPaginatedResult);

      const result = await service.findInstructorCourses(dto, userId);

      expect(findUserSpy).toHaveBeenCalledWith({ userId });
      expect(paginateSpy).toHaveBeenCalledWith(
        { limit: 5, page: 2 },
        courseRepository,
        {
          where: {
            instructor: { id: userId },
          },
        },
      );
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('getCourse', () => {
    const courseId = 99;
    const mockCourse = { id: courseId, title: 'Sample Course' } as Course;

    it('should return the course when it is found', async () => {
      const findSpy = jest
        .spyOn(courseRepository, 'findOne')
        .mockResolvedValue(mockCourse);

      const result = await service.getCourse(courseId);

      expect(findSpy).toHaveBeenCalledWith({
        where: { id: courseId },
        relations: { lectures: true },
      });
      expect(result).toEqual(mockCourse);
    });

    it('should throw NotFoundException if course is not found', async () => {
      jest.spyOn(courseRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getCourse(courseId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateCourse', () => {
    const courseId = 99;
    const userId = 'authorized-instructor-id';
    const patchDto: PatchCourseDto = { title: 'Updated Course Title' };

    const mockCourseWithInstructor = {
      id: courseId,
      title: 'Original Title',
      instructor: { id: userId },
    } as Course;

    it('should throw NotFoundException if course to update does not exist', async () => {
      jest.spyOn(courseRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateCourse(patchDto, courseId, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if the user attempting updates is not the owner', async () => {
      const unauthorizedMockCourse = {
        ...mockCourseWithInstructor,
        instructor: { id: 'different-instructor-id' },
      } as Course;

      jest
        .spyOn(courseRepository, 'findOne')
        .mockResolvedValue(unauthorizedMockCourse);

      await expect(
        service.updateCourse(patchDto, courseId, userId),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should execute update on repository if validation passes successfully', async () => {
      const updateResult: UpdateResult = {
        raw: [],
        affected: 1,
        generatedMaps: [],
      };

      jest
        .spyOn(courseRepository, 'findOne')
        .mockResolvedValue(mockCourseWithInstructor);

      const updateSpy = jest
        .spyOn(courseRepository, 'update')
        .mockResolvedValue(updateResult);

      const result = await service.updateCourse(patchDto, courseId, userId);

      expect(updateSpy).toHaveBeenCalledWith({ id: courseId }, patchDto);
      expect(result).toEqual(updateResult);
    });
  });

  describe('deleteCourse', () => {
    const courseId = 99;
    const userId = 'authorized-instructor-id';
    const mockCourseWithInstructor = {
      id: courseId,
      instructor: { id: userId },
    } as Course;

    it('should throw NotFoundException if course to delete does not exist', async () => {
      jest.spyOn(courseRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteCourse(courseId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if user trying to delete is not the owner', async () => {
      const unauthorizedMockCourse = {
        ...mockCourseWithInstructor,
        instructor: { id: 'different-instructor-id' },
      } as Course;

      jest
        .spyOn(courseRepository, 'findOne')
        .mockResolvedValue(unauthorizedMockCourse);

      await expect(service.deleteCourse(courseId, userId)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should call delete on repository if validation passes successfully', async () => {
      const deleteResult: DeleteResult = {
        raw: [],
        affected: 1,
      };

      jest
        .spyOn(courseRepository, 'findOne')
        .mockResolvedValue(mockCourseWithInstructor);

      const deleteSpy = jest
        .spyOn(courseRepository, 'delete')
        .mockResolvedValue(deleteResult);

      const result = await service.deleteCourse(courseId, userId);

      expect(deleteSpy).toHaveBeenCalledWith({ id: courseId });
      expect(result).toEqual(deleteResult);
    });
  });
});
