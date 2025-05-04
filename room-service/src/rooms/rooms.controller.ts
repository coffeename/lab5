import { Router, Request, Response } from 'express';
import { RoomsService } from './rooms.service';
import { SlotsService } from './slots.service';
import { adminGuard } from '../admin.middleware';

export const roomsRouter = Router();
const roomsService = new RoomsService();
const slotsService = new SlotsService();

// ------------------ КІМНАТИ ------------------ //

// POST /rooms (тільки для admin)
roomsRouter.post('/', adminGuard, async (req: Request, res: Response) => {
  try {
    const room = await roomsService.createRoom(req.body);
    return res.status(201).json(room);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /rooms (всім)
roomsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const rooms = await roomsService.getAllRooms();
    return res.json(rooms);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /rooms/:id (всім)
roomsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const room = await roomsService.getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.json(room);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /rooms/:id (тільки для admin)
roomsRouter.put('/:id', adminGuard, async (req: Request, res: Response) => {
  try {
    const updatedRoom = await roomsService.updateRoom(req.params.id, req.body);
    if (!updatedRoom) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.json(updatedRoom);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// DELETE /rooms/:id (тільки для admin)
roomsRouter.delete('/:id', adminGuard, async (req: Request, res: Response) => {
  try {
    const result = await roomsService.deleteRoom(req.params.id);
    if (result.affected === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.json({ message: 'Room deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ------------------ СЛОТИ ------------------ //

// POST /rooms/:roomId/slots (тільки для admin)
roomsRouter.post(
  '/:roomId/slots',
  adminGuard,
  async (req: Request, res: Response) => {
    try {
      const { start_time, end_time, is_available } = req.body;
      const roomId = req.params.roomId;

      const newSlot = await slotsService.createSlot(
        roomId,
        new Date(start_time),
        new Date(end_time),
        is_available
      );

      return res.status(201).json(newSlot);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
);

// GET /rooms/:roomId/slots (всім)
roomsRouter.get('/:roomId/slots', async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    const slots = await slotsService.getSlotsForRoom(roomId);
    return res.json(slots);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /rooms/slots/:slotId (всім)
roomsRouter.get('/slots/:slotId', async (req: Request, res: Response) => {
  try {
    const slotId = req.params.slotId;
    const slot = await slotsService.getSlotById(slotId);
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    return res.json(slot);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /rooms/slots/:slotId (тільки для admin)
roomsRouter.put(
  '/slots/:slotId',
  adminGuard,
  async (req: Request, res: Response) => {
    try {
      const slotId = req.params.slotId;
      const updatedSlot = await slotsService.updateSlot(slotId, req.body);
      if (!updatedSlot) {
        return res.status(404).json({ error: 'Slot not found' });
      }
      return res.json(updatedSlot);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
);

// DELETE /rooms/slots/:slotId (тільки для admin)
roomsRouter.delete(
  '/slots/:slotId',
  adminGuard,
  async (req: Request, res: Response) => {
    try {
      const slotId = req.params.slotId;
      const deleted = await slotsService.deleteSlot(slotId);
      if (!deleted) {
        return res.status(404).json({ error: 'Slot not found' });
      }
      return res.json({ message: 'Slot deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
);