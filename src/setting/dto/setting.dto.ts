import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsISO8601, IsOptional, IsString, IsUrl } from 'class-validator';

export class SettingDto {
  id: number;

  @ApiProperty()
  @IsOptional()
  title: string;

  @ApiProperty({ example: 'youtube.com' })
  @IsUrl()
  @IsOptional()
  youtubeUrl: string;

  @ApiProperty()
  youtubeTitle: string;

  @ApiProperty({ example: 'Register' })
  @IsString()
  @IsOptional()
  buttonText: string;

  @ApiProperty({ example: 'google.com' })
  @IsUrl()
  @IsOptional()
  registerFormUrl: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty()
  @IsISO8601()
  @IsOptional()
  publishDate: Date;

  @ApiProperty()
  @IsISO8601()
  @IsOptional()
  endDate: Date;

  constructor(partial: Partial<SettingDto>) {
    Object.assign(this, partial);
  }
}
