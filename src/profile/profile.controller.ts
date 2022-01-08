import {
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUserId } from 'src/common/types/auth';
import { UserService } from 'src/user/user.service';
import { Profile } from './entities/profile.entity';
import { ProfileService } from './profile.service';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  // @Post()
  // create(@Body() createProfileDto: CreateProfileDto) {
  //   return this.profileService.create(createProfileDto);
  // }

  // @Get()
  // findAll() {
  //   return this.profileService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.profileService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
  //   return this.profileService.update(+id, updateProfileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.profileService.remove(+id);
  // }

  @Post('upload')
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
