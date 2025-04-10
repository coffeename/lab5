import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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

  @Column({ nullable: true })
  description!: string;

  @CreateDateColumn()
  created_at!: Date;
}
