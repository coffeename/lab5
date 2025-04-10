import { AppDataSource } from './ormconfig';
import express from 'express';
import { usersRouter } from './users/users.controller';

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('Connected to PostgreSQL via DataSource');

    const app = express();
    app.use(express.json());

    app.use('/users', usersRouter);

    app.listen(3000, () => {
      console.log('User Service running on port 3000');
    });
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
  }
}

bootstrap();
