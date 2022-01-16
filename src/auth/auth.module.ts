import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from 'src/profile/profile.module';
import { ThirdPartyModule } from 'src/third-party/third-party.module';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Token } from './entities/token.entity';
import { ValidateCode } from './entities/validate-code.entity';
import { JwtStrategy } from './jwt.strategy';
import { ThirdPartyAuthService } from './third-party-auth.service';
import { ValidateCodeService } from './validate-code.service';

@Global()
@Module({
  imports: [
    UserModule,
    ProfileModule,
    PassportModule,
    ThirdPartyModule,
    TypeOrmModule.forFeature([User, Token, ValidateCode]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.tokenDuration') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ThirdPartyAuthService, ValidateCodeService, JwtStrategy],
  exports: [AuthService, ThirdPartyAuthService, ValidateCodeService, JwtModule],
})
export class AuthModule {}
