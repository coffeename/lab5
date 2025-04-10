import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum BookingStatus {
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled"
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;  

  @Column()
  room_id!: string; 

  @Column({ type: 'timestamp' })
  start_time!: Date;

  @Column({ type: 'timestamp' })
  end_time!: Date;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.CONFIRMED })
  status!: BookingStatus;

  @CreateDateColumn()
  created_at!: Date;
}
