import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from 'src/auth/dto/register.dto';
import {
  CheckPolicies,
  ManagePolicyHandler,
  UpdateUserPolicyHandler,
} from 'src/casl/policyhandler';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @CheckPolicies(new ManagePolicyHandler())
  @Post()
  create(@Body() registerDto: RegisterDto) {
    const userDto = new UserDto({
      email: registerDto.email,
      username: registerDto.username,
      password: registerDto.password,
    });
    return this.userService.create(userDto);
  }

  @CheckPolicies(new ManagePolicyHandler())
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @CheckPolicies(new ManagePolicyHandler())
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @CheckPolicies(new UpdateUserPolicyHandler())
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() userDto: UpdateUserDto) {
    return this.userService.update(id, userDto);
  }

  @CheckPolicies(new ManagePolicyHandler())
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
