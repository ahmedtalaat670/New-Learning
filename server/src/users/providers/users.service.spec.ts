import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FindUserDto } from '../dtos/find-user.dto';
import { GoogleUserDto } from '../dtos/google-user.dto';
import { UserRoles } from '../enums/user-roles.enum';

export type MockRepo<T extends ObjectLiteral, K extends keyof Repository<T>> = {
  [P in K]: jest.Mock;
} & Omit<Repository<T>, K>;

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepo<User, 'findOne' | 'create' | 'save'>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepo<User, 'findOne' | 'create' | 'save'>>(
      getRepositoryToken(User),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'test',
      email: 'test@example.com',
      password: 'Test1234$',
      role: UserRoles.USER,
    };

    it('should successfully create and save a new user', async () => {
      const mockUser = { id: 'uuid-1', ...createUserDto } as User;

      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw a ConflictException if the email is already taken', async () => {
      const existingUser = { id: 'uuid-1', email: createUserDto.email } as User;
      userRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        new ConflictException('there is account with this email'),
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findOneById', () => {
    const findUserDto: FindUserDto = { userId: 'uuid-1' };

    it('should return a user if found', async () => {
      const mockUser = { id: 'uuid-1', email: 'test@example.com' } as User;
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneById(findUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: findUserDto.userId },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw a NotFoundException if user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneById(findUserDto)).rejects.toThrow(
        new NotFoundException('there is no user with this id'),
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: findUserDto.userId },
      });
    });
  });

  describe('findOneByEmail', () => {
    const email = 'test@example.com';

    it('should return a user if email exists', async () => {
      const mockUser = { id: 'uuid-1', email } as User;
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneByEmail(email);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if email does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.findOneByEmail(email);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });
  });

  describe('findOneByGoogleId', () => {
    const googleId = 'google-12345';

    it('should return a user if Google ID exists', async () => {
      const mockUser = { id: 'uuid-1', googleId } as User;
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneByGoogleId(googleId);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { googleId },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if Google ID does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.findOneByGoogleId(googleId);

      expect(result).toBeNull();
    });
  });

  describe('createGoogleUser', () => {
    const googleUserDto: GoogleUserDto = {
      email: 'google@example.com',
      googleId: 'google-12345',
    } as GoogleUserDto;

    it('should create a Google user with default role if none is provided', async () => {
      const mockUser = {
        ...googleUserDto,
        role: UserRoles.USER,
      } as User;

      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      const result = await service.createGoogleUser(googleUserDto);

      expect(userRepository.create).toHaveBeenCalledWith({
        ...googleUserDto,
        role: UserRoles.USER,
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });
});
