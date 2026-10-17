import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult, DeepPartial } from 'typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CourseProgressService } from './course-progress.service';
import { CourseProgress } from '../course-progress.entity';
import { UsersService } from 'src/users/providers/users.service';
import { CoursesService } from 'src/courses/providers/courses.service';
import { StudentCoursesService } from 'src/student-courses/providers/student-courses.service';
import { CreateCourseProgressDto } from '../dtos/create-course-progress.dto';
import { User } from 'src/users/user.entity';
import { Course } from 'src/courses/course.entity';

describe('CourseProgressService', () => {
  let service: CourseProgressService;
  let courseProgressRepository: Repository<CourseProgress>;
  let usersService: UsersService;
  let coursesService: CoursesService;
  let studentCoursesService: StudentCoursesService;

  const mockCourseProgressRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockUsersService = {
    findOneById: jest.fn(),
  };

  const mockCoursesService = {
    getCourse: jest.fn(),
  };

  const mockStudentCoursesService = {
    findOneById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseProgressService,
        {
          provide: getRepositoryToken(CourseProgress),
          useValue: mockCourseProgressRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
        {
          provide: StudentCoursesService,
          useValue: mockStudentCoursesService,
        },
      ],
    }).compile();

    service = module.get<CourseProgressService>(CourseProgressService);
    courseProgressRepository = module.get<Repository<CourseProgress>>(
      getRepositoryToken(CourseProgress),
    );
    usersService = module.get<UsersService>(UsersService);
    coursesService = module.get<CoursesService>(CoursesService);
    studentCoursesService = module.get<StudentCoursesService>(
      StudentCoursesService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const userId = 'user-123';
    const dto: CreateCourseProgressDto = { courseId: 456 };

    const mockUser = { id: userId, name: 'John Doe' } as User;
    const mockCourse = { id: 456, title: 'Awesome Course' } as Course;
    const mockProgress = {
      id: 1,
      completed: false,
      user: mockUser,
      course: mockCourse,
    } as CourseProgress;

    it('should successfully create and save course progress', async () => {
      const findStudentSpy = jest
        .spyOn(studentCoursesService, 'findOneById')
        .mockResolvedValue(
          null as unknown as Awaited<
            ReturnType<StudentCoursesService['findOneById']>
          >,
        );

      const findUserSpy = jest
        .spyOn(usersService, 'findOneById')
        .mockResolvedValue(mockUser);

      const getCourseSpy = jest
        .spyOn(coursesService, 'getCourse')
        .mockResolvedValue(mockCourse);

      const createSpy = jest
        .spyOn(courseProgressRepository, 'create')
        .mockReturnValue(mockProgress);

      const saveSpy = jest
        .spyOn(courseProgressRepository, 'save')
        .mockResolvedValue(mockProgress);

      const result = await service.create(dto, userId);

      expect(findStudentSpy).toHaveBeenCalledWith(dto.courseId, userId);
      expect(findUserSpy).toHaveBeenCalledWith({ userId });
      expect(getCourseSpy).toHaveBeenCalledWith(dto.courseId);
      expect(createSpy).toHaveBeenCalledWith({
        user: mockUser,
        course: mockCourse,
        completed: false,
      });
      expect(saveSpy).toHaveBeenCalledWith(mockProgress);
      expect(result).toEqual(mockProgress);
    });
  });

  describe('findOne', () => {
    const courseId = 456;
    const userId = 'user-123';
    const mockProgress = { id: 1, completed: false } as CourseProgress;

    it('should return existing course progress if found', async () => {
      const findSpy = jest
        .spyOn(courseProgressRepository, 'findOne')
        .mockResolvedValue(mockProgress);

      const result = await service.findOne(courseId, userId);

      expect(findSpy).toHaveBeenCalledWith({
        where: { course: { id: courseId }, user: { id: userId } },
      });
      expect(result).toEqual(mockProgress);
    });

    it('should create and return new course progress if not found', async () => {
      jest.spyOn(courseProgressRepository, 'findOne').mockResolvedValue(null);

      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValue(mockProgress);

      const result = await service.findOne(courseId, userId);

      expect(createSpy).toHaveBeenCalledWith({ courseId }, userId);
      expect(result).toEqual(mockProgress);
    });
  });

  describe('delete', () => {
    const progressId = 1;
    const userId = 'user-123';
    const mockProgressWithUser = {
      id: progressId,
      user: { id: userId },
    } as CourseProgress;

    it('should throw NotFoundException if course progress is not found', async () => {
      jest.spyOn(courseProgressRepository, 'findOne').mockResolvedValue(null);

      await expect(service.delete(progressId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if current user is not the owner of course progress', async () => {
      const unauthorizedProgress = {
        id: progressId,
        user: { id: 'other-user-uuid' },
      } as CourseProgress;

      jest
        .spyOn(courseProgressRepository, 'findOne')
        .mockResolvedValue(unauthorizedProgress);

      await expect(service.delete(progressId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should successfully call delete repository method when authorized', async () => {
      const deleteResult: DeleteResult = {
        raw: [],
        affected: 1,
      };

      jest
        .spyOn(courseProgressRepository, 'findOne')
        .mockResolvedValue(mockProgressWithUser);

      const deleteSpy = jest
        .spyOn(courseProgressRepository, 'delete')
        .mockResolvedValue(deleteResult);

      const result = await service.delete(progressId, userId);

      expect(deleteSpy).toHaveBeenCalledWith({ id: progressId });
      expect(result).toEqual(deleteResult);
    });
  });

  describe('complete', () => {
    it('should set completed property, update timestamp, and save state', async () => {
      const mockProgress = {
        id: 1,
        completed: false,
        completionDate: undefined,
      } as unknown as CourseProgress;

      const saveSpy = jest
        .spyOn(courseProgressRepository, 'save')
        .mockImplementation((progress: DeepPartial<CourseProgress>) => {
          return Promise.resolve(progress as CourseProgress);
        });

      const result = await service.complete(mockProgress);

      expect(result.completed).toBe(true);
      expect(result.completionDate).toBeInstanceOf(Date);
      expect(saveSpy).toHaveBeenCalledWith(mockProgress);
    });
  });
});
