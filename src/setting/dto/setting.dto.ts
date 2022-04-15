import { ApiProperty } from '@nestjs/swagger';
import { Youtube } from 'src/common/interface/youtube';

export class SettingDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  coverImgUrl: string;

  @ApiProperty()
  youtube: Youtube;

  @ApiProperty({ example: 'Register' })
  buttonText: string;

  @ApiProperty({ example: 'google.com' })
  registerFormUrl: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  publishDate: Date;

  @ApiProperty()
  endDate: Date;

  constructor(partial: Partial<SettingDto>) {
    Object.assign(this, partial);
  }
}
