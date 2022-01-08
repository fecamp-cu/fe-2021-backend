import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { editProfileDto } from 'src/auth/dto/edit-profile.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { PoliciesGuard } from 'src/casl/policyguard';
import { CheckPolicies, ReadPolicyHandler } from 'src/casl/policyhandler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  create(@Body() registerDto: RegisterDto) {
    return this.userService.create(registerDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadPolicyHandler())
  findAll() {
    return this.userService.findAll();
  }
  // async findAll(@Req() req) {
  //   const user = await this.userService.findOne(req.user.id);
  //   const ability = await this.caslAbilityFactory.createForUser(user);
  //   if (ability.can(Action.CREATE, 'all')) {
  //     return this.userService.findAll();
  //   }
  //   throw new HttpException('Insufficiency permission', HttpStatus.FORBIDDEN);
  // }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() editProfileDto: editProfileDto) {
    return this.userService.update(+id, editProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
