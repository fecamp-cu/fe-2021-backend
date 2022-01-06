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
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

const SALTROUND = 10;
@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepositary: Repository<User>) {}
  async create(registerDto: RegisterDto): Promise<UserDto> {
    const findUser = await this.userRepositary.findOne({ username: registerDto.username });
    if (findUser) {
      throw new UnprocessableEntityException({
        reason: 'INVALID_INPUT',
        message: 'User already existed',
      });
    }
    const findUserByEmail = await this.userRepositary.findOne({ email: registerDto.email });
    if (findUserByEmail) {
      throw new UnprocessableEntityException({
        reason: 'INVALID_INPUT',
        message: 'Email already existed',
      });
    }
    registerDto.password = await bcrypt.hash(registerDto.password, SALTROUND);

    const user = this.userRepositary.create(registerDto);
    const createdUser = await this.userRepositary.save(user);
    return new UserDto({
      id: createdUser.id,
      username: createdUser.username,
    });
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepositary.find();
    return users.map(
      user =>
        new UserDto({
          id: user.id,
          username: user.username,
        }),
    );
  }

  async Login(loginDto: LoginDto): Promise<UserDto> {
    const user = await this.userRepositary.findOne({ username: loginDto.username });
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

  async findOne(id: number): Promise<UserDto> {
    const user = await this.userRepositary.findOne({ id: id });

    if (!user) {
      throw new NotFoundException({ reason: 'NOT_FOUND_ENTITY', message: 'Not found user' });
    }
    return new UserDto({
      id: user.id,
      username: user.username,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const update: UpdateResult = await this.userRepositary.update(id, updateUserDto);
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, SALTROUND);
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
    const deleted: DeleteResult = await this.userRepositary.softDelete(id);
    if (deleted.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'user not found',
      });
    }
    const user = await this.findOne(id);
    return user;
  }
}
