import { Test, TestingModule } from '@nestjs/testing';
import { CourseProgressController } from './course-progress.controller';
import { CourseProgressService } from './providers/course-progress.service';
import { DeleteResult } from 'typeorm';
import { CourseProgress } from './course-progress.entity';

describe('CourseProgressController', () => {
  let controller: CourseProgressController;
  let service: CourseProgressService;

  const mockCourseProgressService = {
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseProgressController],
      providers: [
        {
          provide: CourseProgressService,
          useValue: mockCourseProgressService,
        },
      ],
    }).compile();

    controller = module.get<CourseProgressController>(CourseProgressController);
    service = module.get<CourseProgressService>(CourseProgressService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findCourseProgress', () => {
    it('should delegate courseId and user sub to courseProgressService.findOne', async () => {
      const courseId = 42;
      const sub = 'student-uuid-123';
      const mockProgress = {
        id: 12,
        completed: false,
        createdAt: new Date(),
      } as CourseProgress;

      const findOneSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockProgress);

      const result = await controller.findCourseProgress(courseId, sub);

      expect(findOneSpy).toHaveBeenCalledWith(courseId, sub);
      expect(result).toEqual(mockProgress);
    });
  });

  describe('deleteCourseProgress', () => {
    it('should delegate progressId and user sub to courseProgressService.delete', async () => {
      const courseProgressId = 1;
      const sub = 'student-uuid-123';

      const deleteResult: DeleteResult = {
        raw: [],
        affected: 1,
      };

      const deleteSpy = jest
        .spyOn(service, 'delete')
        .mockResolvedValue(deleteResult);

      const result = await controller.deleteCourseProgress(
        courseProgressId,
        sub,
      );

      expect(deleteSpy).toHaveBeenCalledWith(courseProgressId, sub);
      expect(result).toEqual(deleteResult);
    });
  });
});
