import { AppDataSource } from '../ormconfig';
import { Booking, BookingStatus } from './booking.entity';
import { AvailableSlot } from '../rooms/slot.entity';

interface CreateBookingDto {
  user_id: string;
  slot_id: string;
}

export class BookingsService {
  private bookingRepo = AppDataSource.getRepository(Booking);
  private slotRepo    = AppDataSource.getRepository(AvailableSlot);

  /**
   * 1) Reserve a slot (isAvailable → false) and create a booking
   */
  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    const { user_id, slot_id } = dto;

    // 1.1 Find slot together with its room
    const slot = await this.slotRepo.findOne({
      where:     { id: slot_id },
      relations: ['room'],     // pull in the Room entity
    });
    if (!slot) {
      throw new Error('Slot not found');
    }
    if (!slot.isAvailable) {
      throw new Error('Slot already booked');
    }

    // 1.2 Mark slot as reserved
    slot.isAvailable = false;
    await this.slotRepo.save(slot);

    // 1.3 Create the booking record
    const booking = this.bookingRepo.create({
      user_id,                           // snake_case column
      room_id:    slot.room.id,         // room relation is now guaranteed
      slot_id:    slot.id,              // snake_case column
      start_time: slot.startTime,       // entity property → timestamp column
      end_time:   slot.endTime,         // entity property → timestamp column
      status:     BookingStatus.CONFIRMED,
    });

    return this.bookingRepo.save(booking);
  }

  /**
   * 2) Return all bookings for a given user, including slot+room data
   */
  async getBookingsByUser(user_id: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where:     { user_id },
      relations: ['slot', 'slot.room'],  // include slot and its room
      order:     { created_at: 'DESC' },
    });
  }

  /**
   * 3) Cancel a booking: unreserve the slot and mark the booking CANCELLED
   */
  async cancelBooking(bookingId: string): Promise<Booking | null> {
    // 3.1 Load the booking together with its slot
    const booking = await this.bookingRepo.findOne({
      where:     { id: bookingId },
      relations: ['slot'],
    });
    if (!booking) {
      return null;
    }

    // 3.2 Unreserve the slot
    booking.slot.isAvailable = true;
    await this.slotRepo.save(booking.slot);

    // 3.3 Mark the booking CANCELLED (instead of deleting)
    booking.status = BookingStatus.CANCELLED;
    const updated = await this.bookingRepo.save(booking);

    return updated;
  }
}