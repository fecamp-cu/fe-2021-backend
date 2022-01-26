import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, MinLength } from 'class-validator';
import { Role } from 'src/common/enums/role';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Fe Camp', description: 'Just a displayname' })
  @IsOptional()
  username: string;

  @ApiPropertyOptional({
    example: 'password',
    description: 'Password must at least 8 character',
    minLength: 8,
  })
  @IsOptional()
  @MinLength(8, { message: 'Password must at least 8 character' })
  password: string;

  @ApiPropertyOptional({
    example: Role.USER,
    description: 'Role of the user',
  })
  @IsOptional()
  @IsIn([Role.USER, Role.ADMIN])
  role: Role;
}
