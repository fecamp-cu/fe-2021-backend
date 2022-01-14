import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SettingDto {
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  youtube_url: string;

  @ApiProperty()
  register_form_url: string;

  @ApiProperty()
  @IsBoolean()
  is_active: boolean;

  constructor(partial: Partial<SettingDto>) {
    Object.assign(this, partial);
  }
}
