import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { TokenDto } from './dto/token.dto';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(@InjectRepository(Token) private tokenRepository: Repository<Token>) {}

  async create(tokenDto: TokenDto): Promise<TokenDto> {
    const token: Token = await this.tokenRepository.create(tokenDto);
    const createdToken: Token = await this.tokenRepository.save(token);
    return new TokenDto({
      id: createdToken.id,
      serviceType: createdToken.serviceType,
      accessToken: createdToken.accessToken,
      refreshToken: createdToken.refreshToken,
      expiresDate: createdToken.expiresDate,
    });
  }

  findAll() {
    return `This action returns all token`;
  }

  async findOne(id: number, relations?: string[]): Promise<TokenDto> {
    let token: Token;
    if (!relations) {
      token = await this.tokenRepository.findOne(id);
    } else {
      token = await this.tokenRepository.findOne(id, { relations });
    }

    if (!token) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'user not found',
      });
    }

    return new TokenDto(token);
  }

  async update(id: number, tokenDto: TokenDto): Promise<TokenDto> {
    const result: UpdateResult = await this.tokenRepository.update(id, tokenDto);
    if (result.affected === 0) {
      throw new NotFoundException({
        reason: 'NOT_FOUND',
        message: 'user not found',
      });
    }
    return await this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }
}
