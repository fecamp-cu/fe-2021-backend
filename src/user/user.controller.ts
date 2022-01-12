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
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { RedeemTokenHandler } from 'src/auth/redeem-token.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@UseGuards(RedeemTokenHandler, JwtAuthGuard)
@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(PoliciesGuard)
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

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() userDto: UserDto) {
    return this.userService.update(id, userDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
