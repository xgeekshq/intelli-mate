import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ZodValidationPipe());
  const configService = app.get(ConfigService);
  await app.listen(configService.get('API_PORT'));
}

void bootstrap();
