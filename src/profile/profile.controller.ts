import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { RequestWithUserId } from 'src/common/types/auth';
import { UserService } from 'src/user/user.service';
import { ProfileDto } from './dto/profile.dto';
import { Profile } from './entities/profile.entity';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  @Post()
  create(@Body() profileDto: ProfileDto) {
    return this.profileService.create(profileDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  @Patch(':id')
  update(@Param('id') id: string, @Body() profileDto: ProfileDto) {
    return this.profileService.update(+id, profileDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ManagePolicyHandler())
  @Put('upload')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadImage(
    @Req() req: RequestWithUserId,
    @UploadedFile() avatar: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response> {
    const user = await this.userService.findOne(req.user.id, ['profile']);
    const { buffer } = avatar;
    const profile: Profile = await this.profileService.uploadImage(user, buffer);
    return res.status(201).json({ message: 'Successfully uploaded profile avatar', profile });
  }
}
