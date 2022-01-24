import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { AppModule } from './app.module';
import { ServiceDownFilter } from './logger/service-down.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: configService.get<string | boolean>('app.origin'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(cookieParser());

  if (!configService.get<boolean>('app.devMode')) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(csurf({ cookie: { key: '_csrf', sameSite: true } }));
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
    .addTag('Setting')
    .addTag('AboutFeContainer')
    .addTag('PhotoPreview')
    .addTag('QualificationPreview')
    .addTag('SponcerContainer')
    .addTag('TimelineEvent')
    .addTag('Item')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(configService.get<number>('app.port'));
}
bootstrap();
