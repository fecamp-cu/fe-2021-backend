import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsString } from 'class-validator';

export class CredentialDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsEmpty()
  accessToken: string;

  @ApiProperty({ example: 'U2FsdGVkX1/Dj8wbJ6M0ZD56Yi...' })
  @IsString()
  refreshToken: string;

  @ApiProperty({ example: 3600 })
  @IsEmpty()
  expiresIn: number;

  constructor(partial: Partial<CredentialDto>) {
    Object.assign(this, partial);
  }
}
