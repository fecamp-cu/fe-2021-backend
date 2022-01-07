import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUserId } from 'src/common/types/auth';
import { ProfileService } from './profile.service';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

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
    const { buffer } = avatar;
    const imageURL = await this.profileService.uploadImage(req.user.id, buffer);
    return res.status(201).json({ message: 'Successfully uploaded profile avatar', profile });
  }
}
