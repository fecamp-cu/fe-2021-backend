import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsUrl } from 'class-validator';

export class SettingDto {
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  @IsUrl()
  youtubeUrl: string;

  @ApiProperty()
  @IsUrl()
  registerFormUrl: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  constructor(partial: Partial<SettingDto>) {
    Object.assign(this, partial);
  }
}
