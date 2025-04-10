import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity('available_slots')
export class AvailableSlot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'room_id' })
  room!: Room;

  @Column()
  start_time!: Date;

  @Column()
  end_time!: Date;

  @Column()
  is_available!: boolean;
}
