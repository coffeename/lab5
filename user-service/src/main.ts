import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

async function bootstrap() {
  const server = express();
  server.get('/health', (_req, res) => res.sendStatus(200));

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  await app.init();

  const port = +(process.env.PORT || 3000);
  server.listen(port, () => {
    console.log(`User Service (Nest) running on port ${port}`);
  });
}
bootstrap();
