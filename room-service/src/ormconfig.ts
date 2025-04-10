import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Room } from './rooms/room.entity';
import { AvailableSlot } from './rooms/slot.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'mydb',
  synchronize: true, 
  entities: [Room, AvailableSlot],
});
