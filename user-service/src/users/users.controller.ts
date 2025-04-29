import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<Partial<User>> {
    try {
      const u = await this.usersService.register(name, email, password);
      const { password: _, ...rest } = u;
      return rest;
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<Partial<User>> {
    try {
      const u = await this.usersService.login(email, password);
      const { password: _, ...rest } = u;
      return rest;
    } catch (e: any) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
