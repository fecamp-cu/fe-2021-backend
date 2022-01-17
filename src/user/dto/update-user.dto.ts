import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, MinLength } from 'class-validator';
import { Role } from 'src/common/enums/role';

export class UpdateUserDto {
  @ApiPropertyOptional()
  username: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(8, { message: 'Password must at least 8 character' })
  password: string;

  @ApiPropertyOptional()
  @IsIn([Role.USER, Role.ADMIN])
  role: Role;
}
