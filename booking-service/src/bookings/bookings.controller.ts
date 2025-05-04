import { Router, Request, Response } from 'express';
import { BookingsService }          from './bookings.service';

export const bookingsRouter = Router();
const bookingsService = new BookingsService();

/**
 * GET /bookings
 * — Повертає всі бронювання поточного користувача.
 *   userId беремо з заголовка x-user-id (API Gateway додає його після веріфікації JWT).
 */
bookingsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string | undefined;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: missing x-user-id header' });
    }
    const bookings = await bookingsService.getBookingsByUser(userId);
    return res.json(bookings);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /bookings
 * — Створює нове бронювання.
 *   З тіла беремо slotId (або slot_id для зворотної сумісності),
 *   а userId — із заголовка x-user-id.
 */
bookingsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const slotId = (req.body.slotId as string) ?? (req.body.slot_id as string);
    const userId = req.headers['x-user-id'] as string | undefined;
    if (!slotId || !userId) {
      return res.status(400).json({ error: 'Missing slotId or x-user-id header' });
    }
    const booking = await bookingsService.createBooking({
      user_id: userId,
      slot_id: slotId,
    });
    return res.status(201).json(booking);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * GET /bookings/:userId
 * — (застарілий) Повертає всі бронювання користувача за параметром userId.
 *   Залишено для зворотної сумісності, але UI тепер використовує GET /bookings.
 */
bookingsRouter.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const bookings = await bookingsService.getBookingsByUser(userId);
    return res.json(bookings);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /bookings/:bookingId
 * — Скасовує бронювання (відновлює слот та видаляє запис).
 */
bookingsRouter.delete('/:bookingId', async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const cancelled = await bookingsService.cancelBooking(bookingId);
    if (!cancelled) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    return res.json({ message: 'Booking cancelled successfully', booking: cancelled });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
