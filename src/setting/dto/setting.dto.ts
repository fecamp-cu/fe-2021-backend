import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SettingDto {
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  youtubeUrl: string;

  @ApiProperty()
  registerFormUrl: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  constructor(partial: Partial<SettingDto>) {
    Object.assign(this, partial);
  }
}
