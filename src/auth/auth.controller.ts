import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeaders,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import * as faker from 'faker';
import * as moment from 'moment';
import {
  accountPasswordMessage,
  emailVerifyMessage,
  resetPasswordMessage,
} from 'src/common/constants/email-message.constant';
import { ServiceType } from 'src/common/enums/service-type';
import { EmailMessage } from 'src/common/enums/third-party';
import { CodeType } from 'src/common/enums/validate-code-type';
import { GoogleAuthData, RequestWithUserId } from 'src/common/types/auth';
import { FacebookUserInfo } from 'src/common/types/facebook/facebook';
import { GoogleUserInfo } from 'src/common/types/google/google-api';
import { GoogleEmailRef } from 'src/common/types/google/google-gmail';
import { FacebookAuthentication } from 'src/third-party/facebook/facebook-auth.service';
import { GoogleAuthentication } from 'src/third-party/google-cloud/google-auth.service';
import { GoogleGmail } from 'src/third-party/google-cloud/google-gmail.service';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { Public } from './auth.decorator';
import { AuthService } from './auth.service';
import { CredentialDto } from './dto/credentials.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TokenDto } from './dto/token.dto';
import { ValidateCodeDto } from './dto/validate-code.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ThirdPartyAuthService } from './third-party-auth.service';
import { ValidateCodeService } from './validate-code.service';

@ApiTags('Auth')
@ApiBearerAuth()
@ApiHeaders([{ name: 'XSRF-TOKEN', description: 'CSRF Token' }])
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly thirdPartyAuthService: ThirdPartyAuthService,
    private readonly validateCodeService: ValidateCodeService,
    private userService: UserService,
    private configService: ConfigService,
    private googleClient: GoogleAuthentication,
    private googleGmail: GoogleGmail,
    private facebookClient: FacebookAuthentication,
  ) {}

  @ApiCreatedResponse({ description: 'Successfully registered user', type: UserDto })
  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto, @Res() res: Response): Promise<Response> {
    const user: UserDto = await this.authService.createUser(registerDto);
    const tokenDto = await this.validateCodeService.generate(user, CodeType.VERIFY_EMAIL);

    const url =
      this.configService.get<string>('app.url') +
      '/verify-email?token=' +
      tokenDto.code +
      '&userId=' +
      user.id;

    this.sendEmail(user, EmailMessage.VERIFY_SUBJECT, emailVerifyMessage(url, user));
    return res.status(HttpStatus.CREATED).json({ message: 'Successfully registered user', user });
  }

  @ApiOkResponse({ description: 'Successfully logged in', type: CredentialDto })
  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<Response> {
    const user: UserDto = await this.userService.Login(loginDto);
    const credentials = await this.signToken(user);
    return res.status(HttpStatus.OK).json(credentials);
  }

  @ApiOkResponse({ description: "Return user's information", type: UserDto })
  @Get('me')
  async profile(
    @Req() req: RequestWithUserId,
    @Query('order') withOrder: string,
    @Res() res: Response,
  ): Promise<Response> {
    let user: UserDto;

    if (withOrder === 'true') {
      user = await this.userService.findWithOrderAndOrderItem(req.user.id);
    } else {
      user = await this.userService.findOne(req.user.id, ['profile']);
    }

    return res.status(HttpStatus.OK).json(user);
  }

  @ApiOkResponse({ description: 'Redeem new token with refresh token', type: CredentialDto })
  @Post('token')
  @Public()
  async redeemToken(@Body() credentialDto: CredentialDto, @Res() res: Response): Promise<Response> {
    const getRefreshToken: TokenDto = await this.authService.findByToken({
      refreshToken: credentialDto.refreshToken,
    });
    const credentials: CredentialDto = await this.signToken(getRefreshToken.user);
    return res.status(HttpStatus.OK).json(credentials);
  }

  @ApiNoContentResponse({ description: 'Successfully logged out' })
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: RequestWithUserId, @Res() res: Response): Promise<Response> {
    await this.signToken(req.user as UserDto);
    return res.send();
  }

  @ApiOkResponse({
    description: 'Successfully send email',
    schema: { properties: { message: { type: 'string', example: 'Successfully sent email.' } } },
  })
  @Post('reset-password/request')
  @Public()
  async requestResetPassword(
    @Body() ResetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ): Promise<Response> {
    const user: UserDto = await this.userService.findByEmail(ResetPasswordDto.email, ['profile']);
    if (user) {
      const expireDate = moment().add(1, 'day').toDate();
      const validateCodeDto: ValidateCodeDto = await this.validateCodeService.generate(
        user,
        CodeType.RESET_PASSWORD,
        expireDate,
      );
      const url =
        this.configService.get<string>('app.url') +
        '/reset-password?' +
        validateCodeDto.code +
        '&userId=' +
        user.id;

      this.sendEmail(
        user,
        EmailMessage.RESET_PASSWORD_SUBJECT,
        resetPasswordMessage(url, moment(expireDate).format('llll')),
      );
    }
    return res.status(HttpStatus.OK).json({ message: 'Successfully sent email' });
  }

  @ApiOkResponse({ description: 'Successfully reset password', type: UserDto })
  @ApiParam({ name: 'token' })
  @Post('reset-password/:token')
  @Public()
  async resetPassword(
    @Param('token') token,
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ): Promise<Response> {
    await this.validateCodeService.use(resetPasswordDto.id, CodeType.RESET_PASSWORD, token);

    const user: UserDto = await this.userService.update(
      resetPasswordDto.id,
      resetPasswordDto as UserDto,
    );

    return res.status(HttpStatus.OK).json(user);
  }

  @ApiOkResponse({
    description: 'Successfully validate code',
    schema: {
      properties: { message: { type: 'string', example: 'Successfully verified an email.' } },
    },
  })
  @Get('verify-email')
  @Public()
  async verifyEmail(
    @Query('token') token: string,
    @Query('userId') userId: string,
    @Res() res: Response,
  ) {
    await this.validateCodeService.use(+userId, CodeType.VERIFY_EMAIL, token);
    await this.userService.update(+userId, new UserDto({ isEmailVerified: true }));
    res.status(HttpStatus.OK).json({ message: 'Successfully verified email' });
  }

  @Get('google')
  @Public()
  googleLogin(@Res() res: Response): void {
    const url: string = this.googleClient.getUrl(
      this.configService.get<string[]>('google.oauth.scope'),
    );
    res.status(HttpStatus.OK).json(url);
  }

  @Get('google/callback')
  @Public()
  async OAuthCallbackGoogle(@Query('code') code: string, @Res() res: Response): Promise<void> {
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

      user = await this.authService.createUser(registerDto, true);
      user = await this.thirdPartyAuthService.storeGoogleToken(tokens, user, userInfo.id);

      this.sendEmail(
        user,
        EmailMessage.ACCOUNT_PASSWORD_SUBJECT,
        accountPasswordMessage(user, password),
      );
    }

    user = await this.thirdPartyAuthService.storeGoogleToken(tokens, user, userInfo.id);
    const credentials: CredentialDto = await this.signToken(user);
    const url = encodeURI(
      this.configService.get<string>('app.url') +
        `?accessToken=${credentials.accessToken}&refreshToken=${credentials.refreshToken}&expiresIn=${credentials.expiresIn}`,
    );

    res.status(HttpStatus.MOVED_PERMANENTLY).redirect(url);
  }

  @Get('facebook')
  @Public()
  facebookLogin(@Res() res: Response): void {
    const url: string = this.facebookClient.getUrl(
      this.configService.get<string[]>('facebook.scope'),
    );
    res.status(HttpStatus.OK).json(url);
  }

  @Get('facebook/callback')
  @Public()
  async OAuthCallbackFacebook(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ): Promise<void> {
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

      user = await this.authService.createUser(registerDto, true);

      this.sendEmail(
        user,
        EmailMessage.ACCOUNT_PASSWORD_SUBJECT,
        accountPasswordMessage(user, password),
      );
    }

    user = await this.thirdPartyAuthService.storeFacebookToken(tokens, user, userInfo.id);

    const credentials: CredentialDto = await this.signToken(user);
    const url = encodeURI(
      this.configService.get<string>('app.url') +
        `?accessToken=${credentials.accessToken}&refreshToken=${credentials.refreshToken}&expiresIn=${credentials.expiresIn}`,
    );

    console.log(url);

    res.status(HttpStatus.MOVED_PERMANENTLY).redirect(url);
  }

  private async signToken(user: UserDto): Promise<CredentialDto> {
    const token: string = await this.authService.createToken(user);
    const tokenDto: TokenDto = await this.authService.createRefreshToken(user.id, token);

    return new CredentialDto({
      accessToken: tokenDto.accessToken,
      refreshToken: tokenDto.refreshToken,
      expiresIn: parseInt(this.configService.get<string>('jwt.tokenDuration')),
    });
  }

  private async sendEmail(userDto: UserDto, subject: string, message: string[]) {
    let tokenDto = await this.thirdPartyAuthService.getAdminToken(ServiceType.GOOGLE);
    tokenDto = await this.thirdPartyAuthService.validateAndRefreshServiceToken(tokenDto);

    const emailRef: GoogleEmailRef = {
      email: userDto.email,
      firstname: userDto.profile.firstName,
      lastname: userDto.profile.lastName,
    };

    this.googleGmail.sendMessage(subject, message, emailRef, tokenDto);
  }
}
