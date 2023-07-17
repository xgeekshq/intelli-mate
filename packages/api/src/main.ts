import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors({
    origin: 'http://localhost:3000', // TODO: replace with env var with correct origin
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ZodValidationPipe());

  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Intelli-mate API documentation')
    .setDescription('API to communicate with Intelli-mate')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.get('API_PORT'));
}

void bootstrap();
