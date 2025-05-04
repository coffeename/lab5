import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async register(name: string, email: string, password: string): Promise<User> {
    const hash = await bcrypt.hash(password, 10);
    const user = this.repo.create({ name, email, password: hash });
    return this.repo.save(user);
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.repo.findOneBy({ email });
    if (!user) throw new UnauthorizedException('Користувача не знайдено');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Невірний пароль');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }
}
