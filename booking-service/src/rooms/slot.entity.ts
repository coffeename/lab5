import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';

@Entity('available_slots')
export class AvailableSlot {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'room_id' })
  room!: Room;

  @Column({ name: 'start_time', type: 'timestamp' })
  startTime!: Date;

  @Column({ name: 'end_time', type: 'timestamp' })
  endTime!: Date;

  @Column({ name: 'is_available' })
  isAvailable!: boolean;
}
