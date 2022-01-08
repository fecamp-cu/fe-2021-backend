import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

const SALTROUND = 10;
@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}
  async create(registerDto: RegisterDto): Promise<UserDto> {
    const findUser = await this.userRepository.findOne({ username: registerDto.username });
    if (findUser) {
      throw new UnprocessableEntityException({
        reason: 'INVALID_INPUT',
        message: 'User already existed',
      });
    }
    const findUserByEmail = await this.userRepository.findOne({ email: registerDto.email });
    if (findUserByEmail) {
      throw new UnprocessableEntityException({
        reason: 'INVALID_INPUT',
        message: 'Email already existed',
      });
    }
    registerDto.password = await bcrypt.hash(registerDto.password, SALTROUND);

    const user = this.userRepository.create(registerDto);
    const createdUser = await this.userRepository.save(user);
    return new UserDto({
      id: createdUser.id,
      username: createdUser.username,
    });
  }

  async findAll(): Promise<UserDto[]> {
    return await this.userRepository.find();
  }

  async Login(loginDto: LoginDto): Promise<UserDto> {
    const user: User = await this.userRepository
      .createQueryBuilder('user')
      .where({ username: loginDto.username })
      .addSelect('user.password')
      .getOne();

    const passwordcompare = await bcrypt.compare(loginDto.password, user.password);
    if (!user || !passwordcompare) {
      throw new UnauthorizedException({
        reason: 'INVALID_INPUT',
        message: 'username or password wrong',
      });
    }
    return new UserDto({
      id: user.id,
      username: user.username,
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id: id });

    if (!user) {
      throw new NotFoundException({ reason: 'NOT_FOUND_ENTITY', message: 'Not found user' });
    }
    return new User({
      id: user.id,
      username: user.username,
    });
  }

  async update(id: number, userDto: UserDto): Promise<UserDto> {
    const update: UpdateResult = await this.userRepository.update(id, userDto);
    if (userDto.password) {
      userDto.password = await bcrypt.hash(userDto.password, SALTROUND);
    }

    if (update.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'user not found',
      });
    }
    const user = await this.findOne(id);
    return user;
  }

  async remove(id: number): Promise<UserDto> {
    const deleted: DeleteResult = await this.userRepository.softDelete(id);
    if (deleted.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'user not found',
      });
    }
    const user = await this.findOne(id);
    return user;
  }

  async findOneWithRelations(id: number, relations: string[]): Promise<UserDto> {
    const user = await this.userRepository.findOne({ id: id }, { relations: relations });

    if (!user) {
      throw new NotFoundException({ reason: 'NOT_FOUND_ENTITY', message: 'Not found user' });
    }
    return new UserDto({
      id: user.id,
      username: user.username,
      profile: user.profile,
    });
  }
}
