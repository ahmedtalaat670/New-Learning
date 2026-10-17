import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { FindUserDto } from '../dtos/find-user.dto';
import { GoogleUserDto } from '../dtos/google-user.dto';
import { UserRoles } from '../enums/user-roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  public async create(createUserDto: CreateUserDto): Promise<User> {
    const existedUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existedUser) {
      throw new ConflictException('there is account with this email');
    }
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }
  public async findOneById(findOneDto: FindUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: findOneDto.userId },
    });
    if (!user) {
      throw new NotFoundException('there is no user with this id');
    }
    return user;
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  public async findOneByGoogleId(googleId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        googleId,
      },
    });
  }

  public async createGoogleUser(googleUserDto: GoogleUserDto) {
    const newUser = this.userRepository.create({
      ...googleUserDto,
      role: googleUserDto.role ?? UserRoles.USER,
    });

    return await this.userRepository.save(newUser);
  }
}
