import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHeaders, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import {
  CheckPolicies,
  ManagePolicyHandler,
  UpdateProfilePolicyHandler,
} from 'src/casl/policyhandler';
import { RequestWithUserId } from 'src/common/types/auth';
import { UserService } from 'src/user/user.service';
import { ProfileDto } from './dto/profile.dto';
import { Profile } from './entities/profile.entity';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@ApiHeaders([{ name: 'XSRF-TOKEN', required: true, description: 'CSRF Token' }])
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @CheckPolicies(new ManagePolicyHandler())
  create(@Body() profileDto: ProfileDto) {
    return this.profileService.create(profileDto);
  }

  @Get()
  @CheckPolicies(new ManagePolicyHandler())
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  @CheckPolicies(new ManagePolicyHandler())
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.profileService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies(new UpdateProfilePolicyHandler())
  update(
    @Req() req: RequestWithUserId,
    @Param('id', ParseIntPipe) id: number,
    @Body() profileDto: ProfileDto,
  ) {
    return this.profileService.update(+id, profileDto);
  }

  @Delete(':id')
  @CheckPolicies(new ManagePolicyHandler())
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.profileService.remove(+id);
  }

  @Put('upload')
  @CheckPolicies(new ManagePolicyHandler())
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadImage(
    @Req() req: RequestWithUserId,
    @UploadedFile() avatar: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.userService.findOne(req.user.id, ['profile']);
    const { buffer } = avatar;
    const profile: Profile = await this.profileService.uploadImage(user, buffer);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Successfully uploaded profile avatar', profile });
  }
}
