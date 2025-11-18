import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const uploadsPath = path.join(__dirname, '..', 'uploads');

  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log("Pasta 'uploads' criada automaticamente!");
  }

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
