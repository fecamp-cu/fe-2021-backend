import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUrl } from 'class-validator';

export class SettingDto {
  id: number;

  @ApiProperty()
  @IsOptional()
  title: string;

  @ApiProperty({ example: 'youtube.com' })
  @IsUrl()
  @IsOptional()
  youtubeUrl: string;

  @ApiProperty({ example: 'google.com' })
  @IsUrl()
  @IsOptional()
  registerFormUrl: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  constructor(partial: Partial<SettingDto>) {
    Object.assign(this, partial);
  }
}
