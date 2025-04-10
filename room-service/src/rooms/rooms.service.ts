import { AppDataSource } from '../ormconfig';
import { Room } from './room.entity';

export class RoomsService {
  private roomRepository = AppDataSource.getRepository(Room);

  async createRoom(data: {
    name: string;
    location: string;
    capacity: number;
    type: string;
    description?: string;
  }) {
    const newRoom = this.roomRepository.create(data);
    return this.roomRepository.save(newRoom);
  }

  async getAllRooms() {
    return this.roomRepository.find();
  }

  async getRoomById(roomId: string) {
    return this.roomRepository.findOne({ where: { id: roomId } });
  }

  async updateRoom(roomId: string, updates: Partial<Room>) {
    await this.roomRepository.update(roomId, updates);
    return this.getRoomById(roomId);
  }

  async deleteRoom(roomId: string) {
    return this.roomRepository.delete(roomId);
  }
}
