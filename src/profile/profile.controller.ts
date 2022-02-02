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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeaders,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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
@ApiHeaders([{ name: 'XSRF-TOKEN', description: 'CSRF Token' }])
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  @ApiCreatedResponse({ description: "Successfully created user's profile", type: ProfileDto })
  @Post()
  @CheckPolicies(new ManagePolicyHandler())
  create(@Body() profileDto: ProfileDto) {
    return this.profileService.create(profileDto);
  }

  @ApiOkResponse({ description: "Successfully get all user's profile", type: [ProfileDto] })
  @Get()
  @CheckPolicies(new ManagePolicyHandler())
  findAll() {
    return this.profileService.findAll();
  }

  @ApiOkResponse({ description: "Successfully get user's profile", type: [ProfileDto] })
  @Get(':id')
  @CheckPolicies(new ManagePolicyHandler())
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.profileService.findOne(+id);
  }

  @ApiOperation({ description: "Update user's profile (can only update your profile)" })
  @ApiOkResponse({ description: "Successfully updated user's profile", type: ProfileDto })
  @Patch(':id')
  @CheckPolicies(new UpdateProfilePolicyHandler())
  update(@Param('id', ParseIntPipe) id: number, @Body() profileDto: ProfileDto) {
    return this.profileService.update(+id, profileDto);
  }

  @ApiNoContentResponse({ description: "Successfully deleted user's profile" })
  @Delete(':id')
  @CheckPolicies(new ManagePolicyHandler())
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.profileService.remove(+id);
  }

  @ApiCreatedResponse({
    description: "Successfully upload user's profile avatar",
    type: ProfileDto,
  })
  @Put(':id/upload')
  @CheckPolicies(new UpdateProfilePolicyHandler())
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadImage(
    @Req() req: RequestWithUserId,
    @UploadedFile() avatar: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response> {
    const { buffer } = avatar;

    if (avatar.size > 20000000) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        reason: 'INVALID_INPUT',
        message: 'Image size is too large',
      });
    }

    if (avatar.mimetype !== 'image/png' && avatar.mimetype !== 'image/jpeg') {
      return res.status(HttpStatus.BAD_REQUEST).json({
        reason: 'INVALID_INPUT',
        message: 'Must be a png or jpeg image',
      });
    }

    const user = await this.userService.findOne(req.user.id, ['profile']);
    const profile: Profile = await this.profileService.uploadImage(user, buffer);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Successfully uploaded profile avatar', profile });
  }
}
