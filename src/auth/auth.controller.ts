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
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as faker from 'faker';
import { GoogleAuthData, RequestWithUserId } from 'src/common/types/auth';
import { FacebookUserInfo } from 'src/common/types/facebook/facebook';
import { GoogleUserInfo } from 'src/common/types/google/google-api';
import { GoogleEmailRef } from 'src/common/types/google/google-gmail';
import { FacebookAuthentication } from 'src/third-party/facebook/facebook-auth.service';
import { GoogleAuthentication } from 'src/third-party/google-cloud/google-auth.service';
import { GoogleGmail } from 'src/third-party/google-cloud/google-gmail.service';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RedeemTokenHandler } from './redeem-token.guard';
import { ThirdPartyAuthService } from './third-party-auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly thirdPartyAuthService: ThirdPartyAuthService,
    private userService: UserService,
    private configService: ConfigService,
    private googleClient: GoogleAuthentication,
    private googleGmail: GoogleGmail,
    private facebookClient: FacebookAuthentication,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response): Promise<Response> {
    const user: UserDto = await this.authService.createUser(registerDto);
    return res.status(HttpStatus.CREATED).json({ message: 'Successfully registered user', user });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<Response> {
    const user: UserDto = await this.userService.Login(loginDto);
    await this.signToken(user, res);
    return res.status(HttpStatus.OK).json(user);
  }

  @Get('me')
  @UseGuards(RedeemTokenHandler, JwtAuthGuard)
  async profile(@Req() req, @Res() res: Response): Promise<Response> {
    const user: UserDto = await this.userService.findOne(req.user.id, ['profile']);
    return res.status(HttpStatus.OK).json(user);
  }

  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Req() req: RequestWithUserId, @Res() res: Response): Response {
    this.authService.clearRefreshToken(req.cookies['refresh_token']);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
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
  async OAuthCallbackGoogle(@Query('code') code: string, @Res() res: Response): Promise<Response> {
    const tokens: GoogleAuthData = await this.googleClient.getTokens(code);
    this.googleClient.setCredentials(tokens);
    const userInfo: GoogleUserInfo = await this.googleClient.getUserInfo();

    let user: UserDto = await this.userService.findByEmail(userInfo.email, ['profile', 'tokens']);

    const password = faker.datatype.string(16);

    if (!user) {
      const registerDto = new RegisterDto({
        username: userInfo.given_name,
        password,
        email: userInfo.email,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        imageUrl: userInfo.picture,
      });

      user = await this.authService.createUser(registerDto);
      this.sendEmail(user, 'Welcome to FE Camp 2022', [
        `Welcome ${userInfo.name} to our FE Camp Family.<br/>`,
        `your password is ${password}`,
      ]);
    }

    user = await this.thirdPartyAuthService.storeGoogleToken(tokens, user, userInfo.id);

    await this.signToken(user, res);
    return res.status(HttpStatus.OK).json(user);
  }

  @Get('facebook')
  facebookLogin(@Res() res: Response): void {
    const url: string = this.facebookClient.getUrl(
      this.configService.get<string[]>('facebook.scope'),
    );
    res.status(HttpStatus.MOVED_PERMANENTLY).redirect(url);
  }

  @Get('facebook/callback')
  async OAuthCallbackFacebook(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ): Promise<Response> {
    const tokens = await this.facebookClient.redeemCode(state, code);
    this.facebookClient.setCredentials(tokens);
    const userInfo: FacebookUserInfo = await this.facebookClient.getUserInfo();

    let user: UserDto = await this.userService.findByEmail(userInfo.email, ['profile', 'tokens']);

    if (!user) {
      const name = userInfo.name.split(' ');
      const firstname = name[0];
      const lastname = name[1];
      const password = faker.datatype.string(16);

      const registerDto = new RegisterDto({
        username: firstname,
        password,
        email: userInfo.email,
        firstName: firstname,
        lastName: lastname,
        imageUrl: userInfo.picture.data.url,
      });

      user = await this.authService.createUser(registerDto);

      this.sendEmail(user, 'Welcome to FE Camp 2022', [
        'hello world.\n',
        `your password is ${password}`,
      ]);
    }

    user = await this.thirdPartyAuthService.storeFacebookToken(tokens, user, userInfo.id);

    await this.signToken(user, res);
    return res.status(HttpStatus.OK).json(user);
  }

  private async signToken(user: UserDto, res: Response) {
    const token: string = await this.authService.createToken(user);
    const refreshToken: string = await this.authService.createRefreshToken(user.id);
    res.cookie('access_token', token, { httpOnly: true, secure: false });
    res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: false });
  }

  private async sendEmail(userDto: UserDto, subject: string, message: string[]) {
    let tokenDto = await this.thirdPartyAuthService.getAdminToken('google');
    tokenDto = await this.thirdPartyAuthService.validateAndRefreshServiceToken(tokenDto);

    const emailRef: GoogleEmailRef = {
      email: userDto.email,
      firstname: userDto.profile.firstName,
      lastname: userDto.profile.lastName,
    };

    this.googleGmail.sendMessage(subject, message, emailRef, tokenDto);
  }
}
