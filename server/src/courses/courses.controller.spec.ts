import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './providers/courses.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { GetCoursesDto } from './dtos/get-courses.dto';
import { PatchCourseDto } from './dtos/patch-course.dto';
import { Course } from './course.entity';
import { UpdateResult, DeleteResult } from 'typeorm';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: CoursesService;

  const mockCoursesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findInstructorCourses: jest.fn(),
    getCourse: jest.fn(),
    updateCourse: jest.fn(),
    deleteCourse: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: mockCoursesService,
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get<CoursesService>(CoursesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCourse', () => {
    it('should forward parameters to coursesService.create', async () => {
      const createDto = { title: 'NestJS Testing' } as CreateCourseDto;
      const sub = 'user-uuid-123';
      const mockCourse = { id: 1, title: 'NestJS Testing' } as Course;

      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValue(mockCourse);

      const result = await controller.createCourse(createDto, sub);

      expect(createSpy).toHaveBeenCalledWith(createDto, sub);
      expect(result).toEqual(mockCourse);
    });
  });

  describe('getAllCourses', () => {
    it('should forward parameters to coursesService.findAll', async () => {
      const queryDto: GetCoursesDto = { limit: 10, page: 1 };

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
          current: '',
        },
      };

      const findAllSpy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValue(mockPaginatedResult);

      const result = await controller.getAllCourses(queryDto);

      expect(findAllSpy).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('getInstructorCourses', () => {
    it('should forward parameters to coursesService.findInstructorCourses', async () => {
      const queryDto: GetCoursesDto = { limit: 5, page: 2 };
      const sub = 'instructor-uuid-123';

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
          current: '',
        },
      };

      const instructorCoursesSpy = jest
        .spyOn(service, 'findInstructorCourses')
        .mockResolvedValue(mockPaginatedResult);

      const result = await controller.getInstructorCourses(queryDto, sub);

      expect(instructorCoursesSpy).toHaveBeenCalledWith(queryDto, sub);
      expect(result).toEqual(mockPaginatedResult);
    });
  });

  describe('getCourse', () => {
    it('should forward the numeric ID to coursesService.getCourse', async () => {
      const courseId = 99;
      const mockCourse = { id: courseId, title: 'Test Course' } as Course;

      const getCourseSpy = jest
        .spyOn(service, 'getCourse')
        .mockResolvedValue(mockCourse);

      const result = await controller.getCourse(courseId);

      expect(getCourseSpy).toHaveBeenCalledWith(courseId);
      expect(result).toEqual(mockCourse);
    });
  });

  describe('updateCourse', () => {
    it('should forward update modifications to coursesService.updateCourse', async () => {
      const courseId = 99;
      const sub = 'instructor-uuid-123';
      const patchDto: PatchCourseDto = { title: 'New Course Title' };

      const updateResult: UpdateResult = {
        raw: [],
        affected: 1,
        generatedMaps: [],
      };

      const updateSpy = jest
        .spyOn(service, 'updateCourse')
        .mockResolvedValue(updateResult);

      const result = await controller.updateCourse(courseId, patchDto, sub);

      expect(updateSpy).toHaveBeenCalledWith(patchDto, courseId, sub);
      expect(result).toEqual(updateResult);
    });
  });

  describe('deleteCourse', () => {
    it('should forward deletion params to coursesService.deleteCourse', async () => {
      const courseId = 99;
      const sub = 'instructor-uuid-123';

      const deleteResult: DeleteResult = {
        raw: [],
        affected: 1,
      };

      const deleteSpy = jest
        .spyOn(service, 'deleteCourse')
        .mockResolvedValue(deleteResult);

      const result = await controller.deleteCourse(courseId, sub);

      expect(deleteSpy).toHaveBeenCalledWith(courseId, sub);
      expect(result).toEqual(deleteResult);
    });
  });
});
