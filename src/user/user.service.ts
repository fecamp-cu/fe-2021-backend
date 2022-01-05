import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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
        message: 'User already existex',
      });
    }
    const SALTROUND = 10;
    registerDto.password = await bcrypt.hash(registerDto.password, SALTROUND);

    const user = this.userRepositary.create(registerDto);
    const createdUser = await this.userRepositary.save(user);
    return new User({
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(loginDto: LoginDto) {
    return `This action returns a #user`;
  }

  update(id: number, editProfileDto: editProfileDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
