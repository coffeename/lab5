import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './ormconfig';
import { bookingsRouter } from './bookings/bookings.controller';

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to PostgreSQL via DataSource (Booking Service)');

    const app = express();
    app.use(express.json());

    app.use('/bookings', bookingsRouter);

    app.listen(3003, () => {
      console.log('Booking Service running on port 3003');
    });
  } catch (error) {
    console.error('Error during Booking Service initialization:', error);
  }
}

bootstrap();
