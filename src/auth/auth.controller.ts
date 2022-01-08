import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private userService: UserService) {}
  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response): Promise<Response> {
    const user: UserDto = await this.userService.create(registerDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Successfully registered user', ...user });
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<Response> {
    const user = await this.userService.Login(loginDto);
    const token: string = await this.authService.createToken(user);
    res.cookie('access_token', token, { httpOnly: true, secure: false });
    return res.status(HttpStatus.OK).json(user);
  }
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req, @Res() res: Response): Promise<Response> {
    const user = await this.userService.findOne(req.user.id);
    return res.status(HttpStatus.OK).json(user);
  }
  @Delete('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response): Response {
    res.clearCookie('access_token');
    return res.send();
  }
}
