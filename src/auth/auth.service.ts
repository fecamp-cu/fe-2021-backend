import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto-js';
import { ServiceType } from 'src/common/types/auth';
import { ProfileDto } from 'src/profile/dto/profile.dto';
import { Profile } from 'src/profile/entities/profile.entity';
import { ProfileService } from 'src/profile/profile.service';
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
    private profileService: ProfileService,
    private configService: ConfigService,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
  ) {}

  async createToken(user: UserDto) {
    const payload = {
      id: user.id,
    };
    return this.jwtService.sign(payload);
  }

  async createRefreshToken(uid: number): Promise<string> {
    const serviceType = 'fecamp';
    const refreshToken = await crypto.AES.encrypt(
      await uuidv4(),
      this.configService.get<string>('secret.encryptionKey'),
    ).toString();
    const user = await this.userService.findOne(uid, ['tokens']);
    const tokenDto = new TokenDto({
      refreshToken,
      expiresDate: new Date(
        Date.now() + parseInt(this.configService.get<string>('jwt.tokenDuration')) * 1000,
      ),
      serviceType,
      user,
    });

    await this.storeToken(tokenDto, user, serviceType);

    return refreshToken;
  }

  async createTokenEntity(tokenDto: TokenDto): Promise<TokenDto> {
    const token: Token = await this.tokenRepository.create(tokenDto);
    const createdToken: Token = await this.tokenRepository.save(token);
    return this.rawToDTO(createdToken);
  }

  async findRefreshToken(refreshToken: string): Promise<TokenDto> {
    const token = await this.tokenRepository.findOne({
      where: { refreshToken },
      relations: ['user'],
    });

    if (!token) {
      throw new UnauthorizedException();
    }

    return this.rawToDTO(token);
  }

  async clearRefreshToken(refreshToken: string): Promise<void> {
    await this.tokenRepository.delete({ refreshToken });
  }

  public async createUser(registerDto: RegisterDto, isVerified: boolean = false): Promise<UserDto> {
    const count = await this.userService.count({ username: registerDto.username });
    if (count > 0) {
      registerDto.username = registerDto.username + '#' + (count + 1);
    }

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
    });

    const nFindUserByEmail = await this.userService.count({ email: userDto.email });
    if (nFindUserByEmail) {
      throw new UnprocessableEntityException({
        reason: 'INVALID_INPUT',
        message: 'Email already existed',
      });
    }

    const profile: Profile = await this.profileService.create(profileDto);
    const user = await this.userService.create(userDto, profile, isVerified);

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

    if (token.accessToken) {
      tokenDto.accessToken = await crypto.AES.decrypt(
        token.accessToken,
        this.configService.get<string>('secret.encryptionKey'),
      ).toString(crypto.enc.Utf8);
    }

    if (token.refreshToken) {
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
