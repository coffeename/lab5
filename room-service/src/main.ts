import express from 'express';
import { json } from 'body-parser';
import { AppDataSource } from './ormconfig';
import { roomsRouter } from './rooms/rooms.controller';
import { startSlotAvailabilityConsumer } from './rabbitmqConsumer';

async function bootstrap() {
  await AppDataSource.initialize();
  console.log('Connected to PostgreSQL via DataSource (Room Service)');

  const app = express();
  app.use(json());

  app.get('/health', (_req, res) => res.sendStatus(200));

  app.use('/rooms', roomsRouter);

  startSlotAvailabilityConsumer();

  const port = process.env.PORT ? +process.env.PORT : 3002;
  app.listen(port, () => {
    console.log(`Room Service running on port ${port}`);
  });
}
bootstrap();
