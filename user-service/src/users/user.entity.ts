import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  //зберігання хешованого пароля
  @Column()
  password!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}
