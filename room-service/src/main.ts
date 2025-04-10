import 'reflect-metadata';
import { AppDataSource } from './ormconfig';
import express from 'express';
import { roomsRouter } from './rooms/rooms.controller';
import { startSlotAvailabilityConsumer } from './rabbitmqConsumer';

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to PostgreSQL via DataSource (Room Service)');

    startSlotAvailabilityConsumer();

    const app = express();
    app.use(express.json());
    app.use('/rooms', roomsRouter);
    app.listen(3002, () => {
      console.log('Room Service running on port 3002');
    });
  } catch (error) {
    console.error('Error during Room Service initialization:', error);
  }
}

bootstrap();