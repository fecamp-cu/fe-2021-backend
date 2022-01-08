import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TokenDto } from './dto/token.dto';
import { TokenService } from './token.service';

@ApiTags('Token')
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  create(@Body() tokenDto: TokenDto) {
    return this.tokenService.create(tokenDto);
  }

  @Get()
  findAll() {
    return this.tokenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tokenService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() tokenDto: TokenDto) {
    return this.tokenService.update(+id, tokenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tokenService.remove(+id);
  }
}
