import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import { User } from './users/user.entity';

export const AppDataSource = new DataSource({
  type:       'postgres',
  host:       process.env.DB_HOST     || 'postgres',
  port:       Number(process.env.DB_PORT) || 5432,    
  username:   process.env.DB_USER     || 'postgres',
  password:   process.env.DB_PASSWORD || 'postgres',
  database:   process.env.DB_NAME     || 'mydb',
  synchronize:true,
  logging:    false,
  entities:   [User],
});