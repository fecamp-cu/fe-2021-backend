import { ApiProperty } from '@nestjs/swagger';

export class AboutFeContainerDto {
  id: number;

  @ApiProperty()
  order: number;

  @ApiProperty()
  text: string;

  constructor(partial: Partial<AboutFeContainerDto>) {
    Object.assign(this, partial);
  }
}
