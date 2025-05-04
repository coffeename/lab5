import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  type: string;
  description: string;
}

export default function RoomsList() {
  const { isAuthenticated, role } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);

  const [showCreate, setShowCreate] = useState(false);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    name: '',
    location: '',
    capacity: 0,
    type: '',
    description: '',
  });

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  useEffect(() => {
    reload();
  }, []);

  const reload = () => {
    axios.get<Room[]>('/rooms').then(res => setRooms(res.data));
  };

  const handleCreate = async () => {
    await axios.post('/rooms', newRoom);
    setShowCreate(false);
    setNewRoom({ name: '', location: '', capacity: 0, type: '', description: '' });
    reload();
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/rooms/${id}`);
    reload();
  };

  const startEdit = (room: Room) => setEditingRoom({ ...room });
  const cancelEdit = () => setEditingRoom(null);
  const handleSave = async () => {
    if (!editingRoom) return;
    const { id, name, location, capacity, type, description } = editingRoom;
    await axios.put(`/rooms/${id}`, { name, location, capacity, type, description });
    setEditingRoom(null);
    reload();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Rooms</h1>

      {isAuthenticated && role === 'admin' && (
        <div style={{ marginBottom: '1em' }}>
          <Button onClick={() => setShowCreate(v => !v)}>
            {showCreate ? 'Cancel Create' : 'Create New Room'}
          </Button>
          {showCreate && (
            <div style={{ marginTop: '0.5em', display: 'grid', gap: '0.5em' }}>
              <input
                placeholder="Name"
                value={newRoom.name}
                onChange={e => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
              />
              <input
                placeholder="Location"
                value={newRoom.location}
                onChange={e => setNewRoom(prev => ({ ...prev, location: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Capacity"
                value={newRoom.capacity}
                onChange={e => setNewRoom(prev => ({ ...prev, capacity: +e.target.value }))}
              />
              <input
                placeholder="Type"
                value={newRoom.type}
                onChange={e => setNewRoom(prev => ({ ...prev, type: e.target.value }))}
              />
              <textarea
                placeholder="Description"
                value={newRoom.description}
                onChange={e => setNewRoom(prev => ({ ...prev, description: e.target.value }))}
              />
              <Button onClick={handleCreate}>Save New Room</Button>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1em' }}>
        {rooms.map(r => (
          <Card key={r.id} style={{ flex: '1 1 300px', padding: '1rem' }}>
            {editingRoom?.id === r.id ? (
              <div style={{ display: 'grid', gap: '0.5em' }}>
                <input
                  value={editingRoom.name}
                  onChange={e =>
                    setEditingRoom(prev => (prev ? { ...prev, name: e.target.value } : prev))
                  }
                />
                <input
                  value={editingRoom.location}
                  onChange={e =>
                    setEditingRoom(prev => (prev ? { ...prev, location: e.target.value } : prev))
                  }
                />
                <input
                  type="number"
                  value={editingRoom.capacity}
                  onChange={e =>
                    setEditingRoom(prev =>
                      prev ? { ...prev, capacity: +e.target.value } : prev
                    )
                  }
                />
                <input
                  value={editingRoom.type}
                  onChange={e =>
                    setEditingRoom(prev => (prev ? { ...prev, type: e.target.value } : prev))
                  }
                />
                <textarea
                  value={editingRoom.description}
                  onChange={e =>
                    setEditingRoom(prev =>
                      prev ? { ...prev, description: e.target.value } : prev
                    )
                  }
                />
                <div style={{ display: 'flex', gap: '0.5em' }}>
                  <Button onClick={handleSave}>Save</Button>
                  <Button onClick={cancelEdit}>Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <h2>{r.name}</h2>
                <p><strong>Location:</strong> {r.location}</p>
                <p><strong>Capacity:</strong> {r.capacity}</p>
                <p><strong>Type:</strong> {r.type}</p>
                <p>{r.description}</p>

                <div style={{ marginTop: '0.5em', display: 'flex', gap: '0.5em' }}>
                  {isAuthenticated && role === 'admin' && (
                    <>
                      <Link to={`/rooms/${r.id}/slots`}>
                        <Button>Manage Slots</Button>
                      </Link>
                      <Button onClick={() => startEdit(r)}>Edit</Button>
                      <Button onClick={() => handleDelete(r.id)}>Delete</Button>
                    </>
                  )}
                  {isAuthenticated && role === 'user' && (
                    <Link to={`/rooms/${r.id}/slots`}>
                      <Button>View Slots</Button>
                    </Link>
                  )}
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
