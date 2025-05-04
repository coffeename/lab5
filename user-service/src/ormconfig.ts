import 'reflect-metadata';
import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/user.entity';

dotenv.config();

const ormConfig: DataSourceOptions = {
  type:       'postgres',
  host:       process.env.DB_HOST     || 'postgres',
  port:       Number(process.env.DB_PORT) || 5432,
  username:   process.env.DB_USER     || 'postgres',
  password:   process.env.DB_PASSWORD || 'postgres',
  database:   process.env.DB_NAME     || 'mydb',
  synchronize:true,
  logging:    false,
  entities:   [User],
};

export default ormConfig;