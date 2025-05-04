import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const server = express();

  // health-check із типами
  server.get('/health', (_req: Request, res: Response) => res.sendStatus(200));

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  // за потреби глобальні пайпи / фільтри
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.init();

  const port = Number(process.env.PORT || 3000);
  server.listen(port, () => {
    console.log(`User Service (Nest) running on port ${port}`);
  });
}
bootstrap();