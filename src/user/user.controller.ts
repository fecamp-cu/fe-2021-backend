import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiHeaders, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import {
  CheckPolicies,
  ManagePolicyHandler,
  UpdateUserPolicyHandler,
} from 'src/casl/policyhandler';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiHeaders([{ name: 'XSRF-TOKEN', description: 'CSRF Token' }])
@UseGuards(JwtAuthGuard, PoliciesGuard)
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @CheckPolicies(new ManagePolicyHandler())
  create(@Body() registerDto: RegisterDto) {
    const userDto = new UserDto({
      email: registerDto.email,
      username: registerDto.username,
      password: registerDto.password,
    });
    return this.userService.create(userDto);
  }

  @Get()
  @CheckPolicies(new ManagePolicyHandler())
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @CheckPolicies(new ManagePolicyHandler())
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(new UpdateUserPolicyHandler())
  update(@Param('id', ParseIntPipe) id: number, @Body() userDto: UpdateUserDto) {
    return this.userService.update(id, userDto);
  }

  @Delete(':id')
  @CheckPolicies(new ManagePolicyHandler())
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
