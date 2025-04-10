import { AppDataSource } from '../ormconfig';
import { AvailableSlot } from './slot.entity';
import { Room } from './room.entity';

export class SlotsService {
  private slotRepository = AppDataSource.getRepository(AvailableSlot);
  private roomRepository = AppDataSource.getRepository(Room);

  // 1. Створення слоту для конкретної кімнати
  async createSlot(
    roomId: string,
    startTime: Date,
    endTime: Date,
    isAvailable: boolean
  ): Promise<AvailableSlot> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new Error('Room not found');
    }

    const newSlot = this.slotRepository.create({
      room,
      start_time: startTime,
      end_time: endTime,
      is_available: isAvailable,
    });

    return this.slotRepository.save(newSlot);
  }

  // 2. Отримати список слотів для конкретної кімнати
  async getSlotsForRoom(roomId: string): Promise<AvailableSlot[]> {
    return this.slotRepository.find({
      where: { room: { id: roomId } },
      relations: ['room'],
    });
  }

  // 3. Отримати конкретний слот за його id
  async getSlotById(slotId: string): Promise<AvailableSlot | null> {
    return this.slotRepository.findOne({
      where: { id: slotId },
      relations: ['room'],
    });
  }

  // 4. Оновити слот (наприклад, змінити is_available чи час)
  async updateSlot(
    slotId: string,
    updates: Partial<AvailableSlot>
  ): Promise<AvailableSlot | null> {
    // Перевіряємо, чи існує слот
    const slot = await this.slotRepository.findOne({ where: { id: slotId } });
    if (!slot) {
      return null; // або киньте помилку
    }

    // Змінюємо потрібні поля
    if (updates.start_time !== undefined) {
      slot.start_time = updates.start_time;
    }
    if (updates.end_time !== undefined) {
      slot.end_time = updates.end_time;
    }
    if (updates.is_available !== undefined) {
      slot.is_available = updates.is_available;
    }
    // Якщо треба оновити room, потрібно знайти кімнату за roomId і присвоїти slot.room = foundRoom

    // Зберігаємо оновлений слот
    return this.slotRepository.save(slot);
  }

  // 5. Видалити слот
  async deleteSlot(slotId: string): Promise<boolean> {
    const result = await this.slotRepository.delete(slotId);
    // result.affected = кількість видалених записів
    return result.affected !== 0;
  }
}
