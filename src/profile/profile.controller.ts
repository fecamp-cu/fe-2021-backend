import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RedeemTokenHandler } from 'src/auth/redeem-token.guard';
import { RequestWithUserId } from 'src/common/types/auth';
import { UserService } from 'src/user/user.service';
import { ProfileDto } from './dto/profile.dto';
import { Profile } from './entities/profile.entity';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@UseGuards(RedeemTokenHandler, JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  @Post()
  create(@Body() profileDto: ProfileDto) {
    return this.profileService.create(profileDto);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() profileDto: ProfileDto) {
    return this.profileService.update(+id, profileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }

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
