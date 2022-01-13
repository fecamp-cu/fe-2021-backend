import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto-js';
import { FacebookAuthData, GoogleAuthData, ServiceType } from 'src/common/types/auth';
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
    const refreshToken = await uuidv4();
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

  async getAdminToken(serviceType: ServiceType): Promise<TokenDto> {
    const admin = await this.userService.findByEmail(
      this.configService.get<string>('admin.email'),
      ['tokens'],
    );

    return admin.tokens.find(token => token.serviceType === serviceType);
  }

  async clearRefreshToken(refreshToken: string): Promise<void> {
    await this.tokenRepository.delete({ refreshToken });
  }

  public async createUser(registerDto: RegisterDto): Promise<UserDto> {
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

    const profile: Profile = await this.profileService.create(profileDto);
    const user = await this.userService.create(userDto, profile);

    return user;
  }

  public async storeGoogleToken(tokens: GoogleAuthData, user: UserDto): Promise<UserDto> {
    const serviceType: ServiceType = 'google';
    const tokenDto = new TokenDto({
      accessToken: await crypto.AES.encrypt(
        tokens.access_token,
        this.configService.get<string>('encryptionKey'),
      ).toString(),

      refreshToken: await crypto.AES.encrypt(
        tokens.refresh_token,
        this.configService.get<string>('encryptionKey'),
      ).toString(),

      expiresDate: new Date(tokens.expiry_date),
      serviceType,
      user,
    });

    return await this.storeToken(tokenDto, user, serviceType);
  }

  public async storeFacebookToken(tokens: FacebookAuthData, user: UserDto): Promise<UserDto> {
    const serviceType: ServiceType = 'facebook';
    const tokenDto = new TokenDto({
      accessToken: await crypto.AES.encrypt(
        tokens.access_token,
        this.configService.get<string>('encryptionKey'),
      ).toString(),

      expiresDate: new Date(tokens.expires_in * 1000 + Date.now()),
      serviceType,
      user,
    });

    return await this.storeToken(tokenDto, user, serviceType);
  }

  async validateAndRefreshServiceToken(tokenDto: TokenDto) {
    const now = new Date();
    if (tokenDto.expiresDate < now) {
      throw new UnauthorizedException();
    }
  }

  private async storeToken(
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

  private async rawToDTO(token: Token): Promise<TokenDto> {
    const tokenDto = new TokenDto({
      id: token.id,
      serviceType: token.serviceType,

      accessToken: crypto.AES.decrypt(
        token.accessToken,
        this.configService.get<string>('encryptionKey'),
      ).toString(crypto.enc.Utf8),

      refreshToken: crypto.AES.decrypt(
        token.refreshToken,
        this.configService.get<string>('encryptionKey'),
      ).toString(crypto.enc.Utf8),

      expiresDate: token.expiresDate,
    });

    if (token.user) {
      const userDto = await this.userService.serialize(token.user);
      tokenDto.user = userDto;
    }

    return tokenDto;
  }
}
