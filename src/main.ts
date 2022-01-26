import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CaslAbilityFactory } from './casl/casl-ability.factory';
import { PoliciesGuard } from './casl/policies.guard';
import { ServiceDownFilter } from './logger/service-down.filter';
import { UserService } from './user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);
  const authService = app.get(AuthService);
  const userService = app.get(UserService);
  const CASLAbilityFactory = app.get(CaslAbilityFactory);

  app.setGlobalPrefix('api');

  app.useGlobalGuards(new JwtAuthGuard(authService, reflector));
  app.useGlobalGuards(new PoliciesGuard(reflector, CASLAbilityFactory, userService, configService));

  app.enableCors({
    origin: configService.get<string | boolean>('app.origin'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(cookieParser());

  if (!configService.get<boolean>('app.devMode')) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(csurf({ cookie: { key: '_csrf', sameSite: true, httpOnly: true } }));
  }

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ServiceDownFilter(configService));

  const config = new DocumentBuilder()
    .setTitle('FE Camp API')
    .setDescription('FE API Docs since 2022')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('User')
    .addTag('Profile')
    .addTag('Shop')
    .addTag('Item')
    .addTag('Order')
    .addTag('Setting')
    .addTag('AboutFeContainer')
    .addTag('PhotoPreview')
    .addTag('QualificationPreview')
    .addTag('SponcerContainer')
    .addTag('TimelineEvent')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(configService.get<number>('app.port'));
}
bootstrap();
