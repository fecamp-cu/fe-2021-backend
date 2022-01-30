import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { FindUser } from 'src/common/types/user';
import { Profile } from 'src/profile/entities/profile.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

const SALTROUND = 10;
@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(
    userDto: UserDto,
    profile?: Profile,
    isEmailVerified: boolean = false,
  ): Promise<UserDto> {
    if (userDto.role) {
      throw new BadRequestException({
        reason: 'INVALID_INPUT',
        message: 'Role must be empty',
      });
    }

    const count = await this.userRepository
      .createQueryBuilder('user')
      .where('"user"."username" like :username', { username: `${userDto.username}%` })
      .getCount();

    if (count > 0) {
      userDto.username = userDto.username + '#' + (count + 1);
    }

    const nFindUserByEmail = await this.count({ email: userDto.email });
    if (nFindUserByEmail) {
      throw new UnprocessableEntityException({
        reason: 'INVALID_INPUT',
        message: 'Email already existed',
      });
    }
    userDto.password = await bcrypt.hash(userDto.password, SALTROUND);

    const user = this.userRepository.create(userDto);

    user.isEmailVerified = isEmailVerified;

    if (profile) {
      user.profile = profile;
    }

    const createdUser = await this.userRepository.save(user);

    return this.rawToDTO(createdUser);
  }

  async findAll(): Promise<UserDto[]> {
    return await this.userRepository.find();
  }

  async Login(loginDto: LoginDto): Promise<UserDto> {
    const user: User = await this.userRepository
      .createQueryBuilder('user')
      .where({ email: loginDto.email })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new UnauthorizedException({
        reason: 'INVALID_INPUT',
        message: 'username or password wrong',
      });
    }

    const passwordcompare = await bcrypt.compare(loginDto.password, user.password);

    if (!passwordcompare) {
      throw new UnauthorizedException({
        reason: 'INVALID_INPUT',
        message: 'username or password wrong',
      });
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException({
        reason: 'NOT_VERIFY_EMAIL',
        message: 'The email must be verify before login',
      });
    }

    return this.rawToDTO(user);
  }

  async findOne(id: number, relations: string[] = ['profile']): Promise<User> {
    const user: User = await this.userRepository.findOne(id, { relations });

    if (!user) {
      throw new NotFoundException({
        reason: 'NOT_FOUND_ENTITY',
        message: 'Not found user',
      });
    }

    const result = new User({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    if (user.profile) {
      result.profile = user.profile;
    }

    if (user.tokens) {
      result.tokens = user.tokens;
    }

    return result;
  }

  async update(id: number, userDto: UpdateUserDto, relations: string[] = []): Promise<UserDto> {
    if (userDto.password) {
      userDto.password = await bcrypt.hash(userDto.password, SALTROUND);
    }

    const user: UserDto = await this.findOne(id, relations);
    await this.userRepository.update(id, userDto);

    return user;
  }

  async remove(id: number): Promise<UserDto> {
    const user: UserDto = await this.findOne(id);
    await this.userRepository.softDelete(id);

    return user;
  }

  async findByEmail(email: string, relations: string[] = []): Promise<UserDto | undefined> {
    return await this.userRepository.findOne({ email }, { relations });
  }

  async findWithOrderAndOrderItem(id): Promise<UserDto> {
    const user: User = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .andWhere('order.status = :status', { status: 'successful' })
      .leftJoinAndSelect('user.customer', 'customer')
      .leftJoinAndSelect('customer.orders', 'order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.item', 'item')
      .getOne();

    return user;
  }

  async count(key: FindUser): Promise<number> {
    return await this.userRepository.count(key);
  }

  public rawToDTO(user: User): UserDto {
    const userDto: UserDto = new UserDto({
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profile,
      role: user.role,
    });

    if (user.tokens) {
      userDto.tokens = user.tokens;
    }

    if (user.profile) {
      userDto.profile = user.profile;
    }

    return userDto;
  }

  public async serialize(user: User | UserDto): Promise<UserDto> {
    return new UserDto({
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profile,
      role: user.role,
    });
  }
}
