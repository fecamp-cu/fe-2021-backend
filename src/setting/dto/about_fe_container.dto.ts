import { ApiProperty } from '@nestjs/swagger';
import { SponcerContainerDto } from './sponcer_container.dto';

export class AboutFeContainerDto {
  id: number;

  @ApiProperty()
  order: number;

  @ApiProperty()
  text: string;

  constructor(partial: Partial<SponcerContainerDto>) {
    Object.assign(this, partial);
  }
}
