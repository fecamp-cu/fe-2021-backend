import { Controller } from '@nestjs/common';
import { ProfileService } from './profile.service';

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
}
