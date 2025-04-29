import express from 'express';
import { json } from 'body-parser';
import { AppDataSource } from './ormconfig';
import { bookingsRouter } from './bookings/bookings.controller';

async function bootstrap() {
  await AppDataSource.initialize();
  console.log('Connected to PostgreSQL via DataSource (Booking Service)');

  const app = express();
  app.use(json());

  app.get('/health', (_req, res) => res.sendStatus(200));
  app.use('/bookings', bookingsRouter);

  const port = process.env.PORT ? +process.env.PORT : 3003;
  app.listen(port, () => {
    console.log(`Booking Service running on port ${port}`);
  });
}
bootstrap();
