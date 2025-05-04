import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';

interface Slot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export default function SlotsList() {
  const { roomId } = useParams<{ roomId: string }>();
  const { isAuthenticated, role } = useAuth();

  const [roomName, setRoomName]       = useState<string>('');
  const [slots, setSlots]             = useState<Slot[]>([]);
  const [showCreate, setShowCreate]   = useState(false);
  const [newSlot, setNewSlot]         = useState({ start_time: '', end_time: '', is_available: true });
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);

  // 1) fetch room name + its slots
  useEffect(() => {
    if (!roomId) return;
    axios
      .get<{ name: string }>(`/rooms/${roomId}`)
      .then(res => setRoomName(res.data.name))
      .catch(console.error);

    reload();
  }, [roomId]);

  const reload = () => {
    if (!roomId) return;
    axios
      .get<Slot[]>(`/rooms/${roomId}/slots`)
      .then(res => setSlots(res.data))
      .catch(console.error);
  };

  // 2) Admin: create new slot
  const handleCreate = async () => {
    if (!roomId) return;
    await axios.post(`/rooms/${roomId}/slots`, {
      start_time: new Date(newSlot.start_time).toISOString(),
      end_time:   new Date(newSlot.end_time).toISOString(),
      is_available: newSlot.is_available,
    });
    setShowCreate(false);
    setNewSlot({ start_time: '', end_time: '', is_available: true });
    reload();
  };

  // 3) Admin: edit existing slot
  const startEdit = (s: Slot) => setEditingSlot({ ...s });
  const cancelEdit = () => setEditingSlot(null);
  const handleSave = async () => {
    if (!editingSlot) return;
    await axios.put(`/rooms/slots/${editingSlot.id}`, {
      start_time:  new Date(editingSlot.start_time).toISOString(),
      end_time:    new Date(editingSlot.end_time).toISOString(),
      is_available: editingSlot.is_available,
    });
    setEditingSlot(null);
    reload();
  };

  // 4) Admin: delete a slot
  const handleDelete = async (slotId: string) => {
    await axios.delete(`/rooms/slots/${slotId}`);
    reload();
  };

  // 5) User: book an available slot
  const handleBook = async (slotId: string) => {
    try {
      await axios.post('/bookings', { slot_id: slotId });
      reload();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || 'Не вдалося забронювати слот');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Slots for {roomName || roomId}</h1>

      {isAuthenticated && role === 'admin' && (
        <div style={{ marginBottom: '1em' }}>
          <Button onClick={() => setShowCreate(v => !v)}>
            {showCreate ? 'Cancel Create' : 'Create New Slot'}
          </Button>
          {showCreate && (
            <div style={{ marginTop: '0.5em', display: 'grid', gap: '0.5em' }}>
              <label>
                Start Time:
                <input
                  type="datetime-local"
                  value={newSlot.start_time}
                  onChange={e => setNewSlot(prev => ({ ...prev, start_time: e.target.value }))}
                />
              </label>
              <label>
                End Time:
                <input
                  type="datetime-local"
                  value={newSlot.end_time}
                  onChange={e => setNewSlot(prev => ({ ...prev, end_time: e.target.value }))}
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={newSlot.is_available}
                  onChange={e => setNewSlot(prev => ({ ...prev, is_available: e.target.checked }))}
                /> Available
              </label>
              <Button onClick={handleCreate}>Save New Slot</Button>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1em' }}>
        {slots.map(s => (
          <Card key={s.id} style={{ padding: '1em' }}>
            {editingSlot?.id === s.id ? (
              <div style={{ display: 'grid', gap: '0.5em' }}>
                <label>
                  Start Time:
                  <input
                    type="datetime-local"
                    value={editingSlot.start_time}
                    onChange={e => setEditingSlot(prev => prev ? { ...prev, start_time: e.target.value } : prev)}
                  />
                </label>
                <label>
                  End Time:
                  <input
                    type="datetime-local"
                    value={editingSlot.end_time}
                    onChange={e => setEditingSlot(prev => prev ? { ...prev, end_time: e.target.value } : prev)}
                  />
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={editingSlot.is_available}
                    onChange={e => setEditingSlot(prev => prev ? { ...prev, is_available: e.target.checked } : prev)}
                  /> Available
                </label>
                <div style={{ display: 'flex', gap: '0.5em' }}>
                  <Button onClick={handleSave}>Save</Button>
                  <Button onClick={cancelEdit}>Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <p>
                  {new Date(s.start_time).toLocaleString()} — {new Date(s.end_time).toLocaleString()}
                </p>
                <p>{s.is_available ? 'Available' : 'Booked'}</p>

                {isAuthenticated && role === 'admin' && (
                  <div style={{ display: 'flex', gap: '0.5em', marginTop: '0.5em' }}>
                    <Button onClick={() => startEdit(s)}>Edit Slot</Button>
                    <Button onClick={() => handleDelete(s.id)}>Delete Slot</Button>
                  </div>
                )}

                {isAuthenticated && role === 'user' && s.is_available && (
                  <Button onClick={() => handleBook(s.id)}>Book</Button>
                )}
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
