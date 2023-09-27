import { CACHE_CLIENT } from '@/common/constants/cache';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { LogLevel, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { RedisIoAdapter } from './chats/adapters/redis-io.adapter';

function getLogLevels(isProduction: boolean): LogLevel[] {
  if (isProduction) {
    return ['log', 'warn', 'error'];
  }
  return ['error', 'warn', 'log', 'verbose', 'debug'];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const cacheClient = app.get(CACHE_CLIENT);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors({
    origin: configService.get('FRONTEND_ORIGIN_URL'),
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ZodValidationPipe());
  app.useLogger(app.get(Logger));

  const config = new DocumentBuilder()
    .setTitle('Intelli-mate API documentation')
    .setDescription('API to communicate with Intelli-mate')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const redisIoAdapter = new RedisIoAdapter(app, configService, cacheClient);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(configService.get('API_PORT'));
}

void bootstrap();
