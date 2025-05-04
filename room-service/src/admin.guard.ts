import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  
  @Injectable()
  export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest();
      const user = (req as any).user;
      if (user?.role === 'admin') {
        return true;
      }
      throw new ForbiddenException('Доступ заборонено: потрібен рівень ADMIN');
    }
  }