import { Test, TestingModule } from '@nestjs/testing';
import { StudentCoursesController } from './student-courses.controller';
import { StudentCoursesService } from './providers/student-courses.service';

describe('StudentCoursesController', () => {
  let controller: StudentCoursesController;

  const studentCoursesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentCoursesController],
      providers: [
        {
          provide: StudentCoursesService,
          useValue: studentCoursesService,
        },
      ],
    }).compile();

    controller = module.get<StudentCoursesController>(StudentCoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createStudentCourse', () => {
    it('should create a student course', async () => {
      const dto = {
        courseId: 1,
      };

      const response = {
        id: 1,
        course: {
          id: 1,
        },
      };

      studentCoursesService.create.mockResolvedValue(response);

      const result = await controller.createStudentCourse(dto, 'user-id');

      expect(studentCoursesService.create).toHaveBeenCalledTimes(1);
      expect(studentCoursesService.create).toHaveBeenCalledWith(dto, 'user-id');
      expect(result).toEqual(response);
    });
  });

  describe('getStudentCourses', () => {
    it('should return paginated student courses', async () => {
      const dto = {
        page: 1,
        limit: 10,
      };

      const response = {
        data: [],
        meta: {
          page: 1,
          limit: 10,
        },
      };

      studentCoursesService.findAll.mockResolvedValue(response);

      const result = await controller.getStudentCourses(dto, 'user-id');

      expect(studentCoursesService.findAll).toHaveBeenCalledTimes(1);
      expect(studentCoursesService.findAll).toHaveBeenCalledWith(
        dto,
        'user-id',
      );
      expect(result).toEqual(response);
    });

    it('should call service with empty query object', async () => {
      studentCoursesService.findAll.mockResolvedValue([]);

      const result = await controller.getStudentCourses({}, 'user-id');

      expect(studentCoursesService.findAll).toHaveBeenCalledWith({}, 'user-id');
      expect(result).toEqual([]);
    });
  });

  describe('getStudentCourse', () => {
    it('should return a student course', async () => {
      const response = {
        id: 1,
      };

      studentCoursesService.findOneById.mockResolvedValue(response);

      const result = await controller.getStudentCourse(1, 'user-id');

      expect(studentCoursesService.findOneById).toHaveBeenCalledTimes(1);
      expect(studentCoursesService.findOneById).toHaveBeenCalledWith(
        1,
        'user-id',
      );
      expect(result).toEqual(response);
    });
  });
});
