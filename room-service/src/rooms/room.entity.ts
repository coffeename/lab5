import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  location!: string;

  @Column()
  capacity!: number;

  @Column()
  type!: string;

  @Column({ type: 'text' })
  description!: string;

  // якщо вам не потрібен стовпець created_at — закоментуйте його або приберіть
  @CreateDateColumn()
  created_at!: Date;
}