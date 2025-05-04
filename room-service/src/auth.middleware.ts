import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const role = req.headers['x-user-role'];
    const userId = req.headers['x-user-id'];
    if (role && userId) {
      (req as any).user = { id: userId, role };
    }
    next();
  }
}