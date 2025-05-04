import 'reflect-metadata';
import * as dotenv     from 'dotenv';
import { hash }        from 'bcrypt';
dotenv.config();

import { AppDataSource } from '../data-source';
import { User, UserRole } from '../users/user.entity';
import { UsersService }    from '../users/users.service';

async function main() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);
  const usersService = new UsersService(repo);

  // создаём админа
  const existing = await repo.findOneBy({ email: 'admin77@gmail.com' });
  if (!existing) {
    const pwdHash = await hash('adminadmin777', 10);
    const admin = repo.create({
      name: 'Administrator',
      email: 'admin77@gmail.com',
      password: pwdHash,
      role: UserRole.ADMIN,
    });
    await repo.save(admin);
    console.log('✅ Admin user seeded');
  } else {
    console.log('ℹ️  Admin already exists');
  }
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});