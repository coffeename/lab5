import { Router, Request, Response } from "express";
import { BookingsService } from "./bookings.service";

export const bookingsRouter = Router();
const bookingsService = new BookingsService();

bookingsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { user_id, room_id, start_time, end_time } = req.body;
    const booking = await bookingsService.createBooking({
      user_id,
      room_id,
      start_time: new Date(start_time),
      end_time: new Date(end_time)
    });
    return res.status(201).json(booking);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

bookingsRouter.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bookings = await bookingsService.getBookingsByUser(userId);
    return res.json(bookings);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

bookingsRouter.delete('/:bookingId', async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const updatedBooking = await bookingsService.cancelBooking(bookingId);
    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    return res.json({ message: 'Booking cancelled successfully', booking: updatedBooking });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
