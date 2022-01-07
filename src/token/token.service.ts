import { Injectable } from '@nestjs/common';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class TokenService {
  create(tokenDto: TokenDto) {
    return 'This action adds a new token';
  }

  findAll() {
    return `This action returns all token`;
  }

  findOne(id: number) {
    return `This action returns a #${id} token`;
  }

  update(id: number, tokenDto: TokenDto) {
    return `This action updates a #${id} token`;
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }
}
