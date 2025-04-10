import { Router, Request, Response } from 'express';
import { UsersService } from './users.service';

export const usersRouter = Router();

const usersService = new UsersService();

// перевірка POST реєстрац
usersRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await usersService.register(name, email, password);
    return res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// перевірка POST логін
usersRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await usersService.login(email, password);
    return res.json({
      message: 'Login successful',
      user,
    });
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
});
