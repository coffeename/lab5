import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Booking } from './bookings/booking.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'mydb',
  synchronize: true,
  entities: [Booking],
});
