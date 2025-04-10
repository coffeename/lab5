import { Router, Request, Response } from 'express';
import { RoomsService } from './rooms.service';
import { SlotsService } from './slots.service';

export const roomsRouter = Router();
const roomsService = new RoomsService();
const slotsService = new SlotsService();

// ------------------ КІМНАТИ ------------------ //
// POST /rooms
roomsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const room = await roomsService.createRoom(req.body);
    return res.status(201).json(room);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /rooms
roomsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const rooms = await roomsService.getAllRooms();
    return res.json(rooms);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /rooms/:id
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

// PUT /rooms/:id
roomsRouter.put('/:id', async (req: Request, res: Response) => {
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

// DELETE /rooms/:id
roomsRouter.delete('/:id', async (req: Request, res: Response) => {
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
// POST /rooms/:roomId/slots
roomsRouter.post('/:roomId/slots', async (req: Request, res: Response) => {
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
});

// Отримання списку слотів для кімнати: GET /rooms/:roomId/slots
roomsRouter.get('/:roomId/slots', async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    const slots = await slotsService.getSlotsForRoom(roomId);
    return res.json(slots);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Інфа про конкр. слот: GET /rooms/slots/:slotId
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

// Оновити слот: PUT /rooms/slots/:slotId
roomsRouter.put('/slots/:slotId', async (req: Request, res: Response) => {
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
});

// Видалити слот: DELETE /rooms/slots/:slotId
roomsRouter.delete('/slots/:slotId', async (req: Request, res: Response) => {
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
});
