import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUrl } from 'class-validator';

export class SettingDto {
  id: number;

  @ApiProperty()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  youtubeUrl: string;

  @ApiProperty()
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
