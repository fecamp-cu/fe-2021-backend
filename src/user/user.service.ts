import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { editProfileDto } from 'src/auth/dto/edit-profile.dto';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

// import { UserData } from 'src/common/types/user';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepositary: Repository<User>) {}
  async create(registerDto: RegisterDto) {
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
    const SALTROUND = 10;
    registerDto.password = await bcrypt.hash(registerDto.password, SALTROUND);

    const user = this.userRepositary.create(registerDto);
    const createdUser = await this.userRepositary.save(user);
    return new User({
      id: createdUser.id,
      username: createdUser.username,
    });
  }

  async findAll() {
    const users = await this.userRepositary.find();
    return users.map(
      user =>
        new User({
          id: user.id,
          username: user.username,
        }),
    );
  }

  async findOne(loginDto: LoginDto) {
    const user = await this.userRepositary.findOne({ username: loginDto.username });
    if (!user) {
      throw new NotFoundException({ reason: 'NOT_FOUND_ENTITY', message: 'Not found user' });
    }
    return new User({
      id: user.id,
      username: user.username,
    });
  }

  async update(id: number, editProfileDto: editProfileDto) {
    const update = await this.userRepositary.update(id, editProfileDto);
    return update;
  }

  async remove(id: number) {
    const deleted = await this.userRepositary.softDelete(id);
    return deleted;
  }
}
