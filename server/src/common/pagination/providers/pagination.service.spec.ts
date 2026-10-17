import { Test, TestingModule } from '@nestjs/testing';
import { REQUEST } from '@nestjs/core';
import { Repository, In } from 'typeorm';
import { PaginationService } from './pagination.service';
import { PaginationQueryDto } from '../dtos/pagination.dto';

interface MockExpressRequest {
  protocol: string;
  get: jest.Mock<string, [string]>;
  path: string;
  query: Record<string, string | string[] | undefined>;
}

describe('PaginationService', () => {
  let service: PaginationService;
  let mockRequest: MockExpressRequest;
  let mockRepository: jest.Mocked<Repository<any>>;

  let findAndCountMock: jest.Mock<Promise<[any[], number]>, [any]>;

  beforeEach(async () => {
    const mockGet = jest
      .fn<string, [string]>()
      .mockReturnValue('localhost:3000');

    mockRequest = {
      protocol: 'http',
      get: mockGet,
      path: '/items',
      query: {},
    };

    findAndCountMock = jest.fn<Promise<[any[], number]>, [any]>();

    mockRepository = {
      findAndCount: findAndCountMock,
    } as unknown as jest.Mocked<Repository<any>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaginationService,
        {
          provide: REQUEST,
          useValue: mockRequest,
        },
      ],
    }).compile();

    service = await module.resolve<PaginationService>(PaginationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('paginate', () => {
    it('should fall back to defaults (page = 1, limit = 10) when query params are missing', async () => {
      const paginationDto: PaginationQueryDto = {};
      const mockItems = [{ id: 1 }, { id: 2 }];
      const totalItems = 20;

      findAndCountMock.mockResolvedValue([mockItems, totalItems]);

      const result = await service.paginate(paginationDto, mockRepository);

      expect(findAndCountMock).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {},
        order: {},
      });

      expect(result.meta).toEqual({
        itemsPerPage: 10,
        totalItems: 20,
        currentPage: 1,
        totalPages: 2,
      });

      expect(result.links.next).toContain('page=2&limit=10');
      expect(result.links.previous).toBeNull();
    });

    it('should calculate pagination skip and take dynamically based on arguments', async () => {
      const paginationDto: PaginationQueryDto = { page: 3, limit: 5 };
      findAndCountMock.mockResolvedValue([[], 15]);

      const result = await service.paginate(paginationDto, mockRepository);

      expect(findAndCountMock).toHaveBeenCalledWith({
        skip: 10,
        take: 5,
        where: {},
        order: {},
      });

      expect(result.meta.totalPages).toBe(3);
      expect(result.links.next).toBeNull();
      expect(result.links.previous).toContain('page=2&limit=5');
    });

    it('should merge query parameters into filters and preserve other queries in links', async () => {
      const paginationDto: PaginationQueryDto = { page: 1, limit: 10 };

      mockRequest.query = {
        category: 'books',
        tags: ['typescript', 'nestjs'],
        limit: '10',
        page: '1',
      };

      findAndCountMock.mockResolvedValue([[], 30]);

      await service.paginate(paginationDto, mockRepository);

      expect(findAndCountMock).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          category: 'books',
          tags: In(['typescript', 'nestjs']),
        },
        order: {},
      });
    });

    it('should build proper sorting orders', async () => {
      const paginationDto: PaginationQueryDto = {};
      mockRequest.query = { sort: 'createdAt:desc' };
      findAndCountMock.mockResolvedValue([[], 0]);

      await service.paginate(paginationDto, mockRepository);

      expect(findAndCountMock).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {},
        order: {
          createdAt: 'DESC',
        },
      });
    });

    it('should default sorting to ASC when sorting order is not DESC', async () => {
      const paginationDto: PaginationQueryDto = {};
      mockRequest.query = { sort: 'title:invalid' };
      findAndCountMock.mockResolvedValue([[], 0]);

      await service.paginate(paginationDto, mockRepository);

      expect(findAndCountMock).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {},
        order: {
          title: 'ASC',
        },
      });
    });

    it('should merge code options.where with request query filters', async () => {
      const paginationDto: PaginationQueryDto = {};
      mockRequest.query = { role: 'admin' };
      const options = { where: { isActive: true } };

      findAndCountMock.mockResolvedValue([[], 0]);

      await service.paginate(paginationDto, mockRepository, options);

      expect(findAndCountMock).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {
          role: 'admin',
          isActive: true,
        },
        order: {},
      });
    });

    it('should properly include relations when they are passed as parameters', async () => {
      const paginationDto: PaginationQueryDto = {};
      const relations = { author: true, comments: { user: true } };

      findAndCountMock.mockResolvedValue([[], 0]);

      await service.paginate(
        paginationDto,
        mockRepository,
        undefined,
        relations,
      );

      expect(findAndCountMock).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {},
        order: {},
        relations,
      });
    });
  });
});
