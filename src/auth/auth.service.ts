import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto-js';
import * as moment from 'moment';
import { ServiceType } from 'src/common/enums/service-type';
import { TokenQuery } from 'src/common/types/auth';
import { ProfileDto } from 'src/profile/dto/profile.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RegisterDto } from './dto/register.dto';
import { TokenDto } from './dto/token.dto';
import { Token } from './entities/token.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
  ) {}

  async createToken(user: UserDto) {
    const payload = {
      id: user.id,
    };
    return this.jwtService.sign(payload);
  }

  async createRefreshToken(uid: number, token: string): Promise<TokenDto> {
    const serviceType = ServiceType.FE_CAMP;

    const refreshToken = await uuidv4();

    const user = await this.userService.findOne(uid, ['tokens']);
    const tokenDuration = parseInt(this.configService.get<string>('jwt.tokenDuration'));

    const tokenDto = new TokenDto({
      accessToken: token,
      refreshToken,
      expiresDate: moment().add(tokenDuration, 's').toDate(),
      serviceType,
      user,
    });

    await this.storeToken(tokenDto, user, serviceType);

    tokenDto.refreshToken = await crypto.AES.encrypt(
      refreshToken,
      this.configService.get<string>('secret.encryptionKey'),
    ).toString();

    return tokenDto;
  }

  async createTokenEntity(tokenDto: TokenDto): Promise<TokenDto> {
    const createdToken: Token = await this.tokenRepository.save(tokenDto);
    return this.rawToDTO(createdToken);
  }

  async findByToken(query: TokenQuery): Promise<TokenDto> {
    if (query.refreshToken) {
      query.refreshToken = await crypto.AES.decrypt(
        query.refreshToken,
        this.configService.get<string>('secret.encryptionKey'),
      ).toString(crypto.enc.Utf8);
    }

    const queriedToken = await this.tokenRepository.findOne({ where: query, relations: ['user'] });

    if (!queriedToken) {
      throw new UnauthorizedException();
    }

    return this.rawToDTO(queriedToken);
  }

  async clearRefreshToken(refreshToken: string): Promise<void> {
    try {
      refreshToken = await crypto.AES.decrypt(
        refreshToken,
        this.configService.get<string>('secret.encryptionKey'),
      ).toString(crypto.enc.Utf8);
    } catch (err) {
      throw new BadRequestException({
        StatusCode: 400,
        reason: 'INVALID_INPUT',
        message: 'Invalid refresh token',
      });
    }

    await this.tokenRepository.delete({ refreshToken });
  }

  public async createUser(registerDto: RegisterDto, isVerified: boolean = false): Promise<UserDto> {
    const profileDto = new ProfileDto({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      imageUrl: registerDto.imageUrl,
      tel: registerDto.tel,
      grade: registerDto.grade,
      school: registerDto.school,
      address: registerDto.address,
      subdistrict: registerDto.subdistrict,
      district: registerDto.district,
      province: registerDto.province,
      postcode: registerDto.postcode,
    });

    const userDto = new UserDto({
      email: registerDto.email,
      username: registerDto.username,
      password: registerDto.password,
      profile: profileDto,
      isEmailVerified: isVerified,
    });

    const user = await this.userService.create(userDto);

    return user;
  }

  public async storeToken(
    tokenDto: TokenDto,
    user: UserDto,
    serviceType: ServiceType,
  ): Promise<UserDto> {
    let token: TokenDto;
    if (user.tokens) {
      token = user.tokens.find(token => token.serviceType === serviceType);
    }

    if (!token) {
      await this.createTokenEntity(tokenDto);
      return this.userService.serialize(user);
    }

    await this.tokenRepository.update(token.id, tokenDto);
    return this.userService.serialize(user);
  }

  public async rawToDTO(token: Token | TokenDto): Promise<TokenDto> {
    const tokenDto = new TokenDto({
      id: token.id,
      serviceType: token.serviceType,
      expiresDate: token.expiresDate,
    });

    if (token.accessToken && token.serviceType !== ServiceType.FE_CAMP) {
      tokenDto.accessToken = await crypto.AES.decrypt(
        token.accessToken,
        this.configService.get<string>('secret.encryptionKey'),
      ).toString(crypto.enc.Utf8);
    }

    if (token.refreshToken && token.serviceType !== ServiceType.FE_CAMP) {
      tokenDto.refreshToken = await crypto.AES.decrypt(
        token.refreshToken,
        this.configService.get<string>('secret.encryptionKey'),
      ).toString(crypto.enc.Utf8);
    }

    if (token.idToken) {
      tokenDto.idToken = await crypto.AES.decrypt(
        token.idToken,
        this.configService.get<string>('secret.encryptionKey'),
      ).toString(crypto.enc.Utf8);
    }

    if (token.user) {
      const userDto = await this.userService.serialize(token.user);
      tokenDto.user = userDto;
    }

    return tokenDto;
  }
}
