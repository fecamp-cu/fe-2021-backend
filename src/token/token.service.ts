import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenDto } from './dto/token.dto';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(@InjectRepository(Token) private tokenRepository: Repository<Token>) {}

  async create(tokenDto: TokenDto): Promise<TokenDto> {
    const token: Token = await this.tokenRepository.create(tokenDto);
    const createdToken: Token = await this.tokenRepository.save(token);
    return new TokenDto(createdToken);
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
