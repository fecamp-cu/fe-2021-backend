import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  @Post()
  create(@Body() registerDto: RegisterDto) {
    return this.userService.create(registerDto.credentials);
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
  findById(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  @Patch(':id')
  update(@Param('id') id: string, @Body() userDto: UserDto) {
    return this.userService.update(+id, userDto);
  }
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
