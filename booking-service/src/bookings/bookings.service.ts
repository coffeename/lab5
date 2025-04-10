import { AppDataSource } from "../ormconfig";
import { Booking, BookingStatus } from "./booking.entity";
import { connectRabbitMQ } from "../rabbitmq";
import { v4 as uuidv4 } from 'uuid';

export class BookingsService {
  private bookingRepository = AppDataSource.getRepository(Booking);

  async checkSlotAvailability(data: { room_id: string; start_time: Date; end_time: Date }): Promise<boolean> {
    const { connection, channel } = await connectRabbitMQ();
    const requestQueue = 'slot_availability_request';
    const { queue: replyQueue } = await channel.assertQueue('', { exclusive: true });
    const correlationId = uuidv4();

    return new Promise<boolean>((resolve, reject) => {
      channel.consume(replyQueue, (msg) => {
        if (msg && msg.properties.correlationId === correlationId) {
          const result = JSON.parse(msg.content.toString());
          resolve(result.available);
          connection.close();
        }
      }, { noAck: true });

      const message = JSON.stringify(data);
      channel.sendToQueue(requestQueue, Buffer.from(message), {
        correlationId,
        replyTo: replyQueue
      });
    });
  }

  async createBooking(data: { user_id: string; room_id: string; start_time: Date; end_time: Date }): Promise<Booking> {
    const isAvailable = await this.checkSlotAvailability({
      room_id: data.room_id,
      start_time: data.start_time,
      end_time: data.end_time
    });

    if (!isAvailable) {
      throw new Error('Slot not available');
    }

    const newBooking = this.bookingRepository.create({
      user_id: data.user_id,
      room_id: data.room_id,
      start_time: data.start_time,
      end_time: data.end_time,
      status: BookingStatus.CONFIRMED,
    });
    return this.bookingRepository.save(newBooking);
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    return this.bookingRepository.find({ where: { user_id: userId } });
  }

  async cancelBooking(bookingId: string): Promise<Booking | null> {
    const booking = await this.bookingRepository.findOne({ where: { id: bookingId } });
    if (!booking) {
      return null;
    }
    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepository.save(booking);
  }
}
