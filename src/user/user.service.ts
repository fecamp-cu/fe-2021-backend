import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { Profile } from 'src/profile/entities/profile.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

const SALTROUND = 10;
@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(userDto: UserDto, profile?: Profile): Promise<UserDto> {
    const findUser = await this.userRepository.findOne({ username: userDto.username });
    if (findUser) {
      throw new UnprocessableEntityException({
        reason: 'INVALID_INPUT',
        message: 'User already existed',
      });
    }
    const findUserByEmail = await this.userRepository.findOne({ email: userDto.email });
    if (findUserByEmail) {
      throw new UnprocessableEntityException({
        reason: 'INVALID_INPUT',
        message: 'Email already existed',
      });
    }
    userDto.password = await bcrypt.hash(userDto.password, SALTROUND);

    const user = this.userRepository.create(userDto);

    if (profile) {
      user.profile = profile;
    }

    const createdUser = await this.userRepository.save(user);

    return new UserDto({
      id: createdUser.id,
      username: createdUser.username,
      profile,
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

  async findOne(id: number, relations?: string[]): Promise<UserDto> {
    let user: User;
    if (!relations) {
      user = await this.userRepository.findOne(id, { relations });
    } else {
      user = await this.userRepository.findOne({ id: id });
    }

    if (!user) {
      throw new NotFoundException({ reason: 'NOT_FOUND_ENTITY', message: 'Not found user' });
    }

    return new UserDto({
      id: user.id,
      username: user.username,
      profile: user.profile,
      tokens: user.tokens,
    });
  }

  async update(id: number, userDto: UserDto, relations?: string[]): Promise<UserDto> {
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

    if (!relations) {
      return await this.findOne(id);
    }
    return await this.findOne(id, relations);
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

  async findByEmail(email: string, relations?: string[]): Promise<UserDto | undefined> {
    if (!relations) {
      return await this.userRepository.findOne({ email });
    }
    return await this.userRepository.findOne({ email }, { relations });

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
