import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setConnection } from './controller';
require('dotenv').config();
async function bootstrap() {
  const conn = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  };
  await setConnection(conn);
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.REST_PORT);
}
bootstrap();
