import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as faker from 'faker';
import { GoogleAuthentication } from 'src/common/google-cloud/google-auth';
import { GoogleUserInfo } from 'src/common/types/google/google-api';
import { OAuthResponse } from 'src/common/types/token';
import { ProfileDto } from 'src/profile/dto/profile.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private googleClient: GoogleAuthentication;
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
    private configService: ConfigService,
  ) {
    this.googleClient = new GoogleAuthentication(this.configService);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response): Promise<Response> {
    const user: UserDto = await this.authService.createUser(registerDto);
    return res.status(HttpStatus.CREATED).json({ message: 'Successfully registered user', user });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<Response> {
    const user: UserDto = await this.userService.Login(loginDto);
    const token: string = await this.authService.createToken(user);
    res.cookie('access_token', token, { httpOnly: true, secure: false });
    return res.status(HttpStatus.OK).json(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req, @Res() res: Response): Promise<Response> {
    const user: UserDto = await this.userService.findOne(req.user.id);
    return res.status(HttpStatus.OK).json(user);
  }

  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response): Response {
    res.clearCookie('access_token');
    return res.send();
  }

  @Get('google')
  googleLogin(@Res() res: Response): void {
    const url: string = this.googleClient.getUrl(
      this.configService.get<string[]>('google.oauth.scope'),
    );
    res.status(HttpStatus.MOVED_PERMANENTLY).redirect(url);
  }

  @Get('google/callback')
  async OAuthCallback(@Query('code') code: string, @Res() res: Response): Promise<Response> {
    const tokens: OAuthResponse = await this.googleClient.getTokens(code);
    this.googleClient.setCredentials(tokens);
    const userInfo: GoogleUserInfo = await this.googleClient.getUserInfo();

    let user: UserDto = await this.userService.findByEmail(userInfo.email, ['profile', 'tokens']);

    if (!user) {
      const registerDto = new RegisterDto({
        credentials: new UserDto({
          username: userInfo.given_name,
          password: faker.datatype.string(16),
          email: userInfo.email,
        }),

        userInfo: new ProfileDto({
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          imageUrl: userInfo.picture,
        }),
      });

      user = await this.authService.createUser(registerDto);
    }

    user = await this.authService.storeToken(tokens, 'google', user);

    const token: string = await this.authService.createToken(user);
    res.cookie('access_token', token, { httpOnly: true, secure: false });
    return res.status(HttpStatus.OK).json(user);
  }
}
