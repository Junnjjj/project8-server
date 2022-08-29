import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  //쿠키를 읽기 위한 쿠키파서
  app.use(cookieParser());

  const PORT = process.env.PORT;
  await app.listen(PORT);
}
bootstrap();
