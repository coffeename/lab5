import React, { useEffect, useState } from 'react';
import SlotsList from './SlotsList';
import './RoomsList.css';

interface Room {
  id: string;
  name: string;
  location: string;
  type: string;
  capacity: number;
}

interface Slot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export default function RoomsList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [slotsByRoom, setSlotsByRoom] = useState<Record<string, Slot[]>>({});
  const [loadingSlots, setLoadingSlots] = useState<Record<string, boolean>>({});
  const [errorSlots, setErrorSlots] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch('/rooms');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: Room[] = await res.json();
        setRooms(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  const handleViewSlots = async (roomId: string) => {
    if (slotsByRoom[roomId]) {
      const copy = { ...slotsByRoom };
      delete copy[roomId];
      setSlotsByRoom(copy);
      return;
    }
    setLoadingSlots(prev => ({ ...prev, [roomId]: true }));
    try {
      const res = await fetch(`/rooms/${roomId}/slots`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const slotsData: Slot[] = await res.json();
      setSlotsByRoom(prev => ({ ...prev, [roomId]: slotsData }));
    } catch (err: any) {
      setErrorSlots(prev => ({ ...prev, [roomId]: err.message }));
    } finally {
      setLoadingSlots(prev => ({ ...prev, [roomId]: false }));
    }
  };

  if (loading) return <div className="loading">Loading rooms…</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const types = Array.from(new Set(rooms.map(r => r.type)));
  const displayed = filter ? rooms.filter(r => r.type === filter) : rooms;

  return (
    <div className="rooms-list-container">
      <div className="rooms-content">
        <h1>Доступні кімнати</h1>

        <div className="filter-section">
          <label htmlFor="type-filter">Фільтрувати за типом:</label>
          <select
            id="type-filter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="">Всі</option>
            {types.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="room-list">
          {displayed.length > 0 ? (
            displayed.map(room => (
              <div key={room.id} className="room-card">
                <h2>{room.name}</h2>
                <p>
                  <strong>Локація:</strong> {room.location}
                </p>
                <p>
                  <strong>Тип:</strong> {room.type}
                </p>
                <p>
                  <strong>Вмістимість:</strong> {room.capacity}
                </p>

                <button
                  onClick={() => handleViewSlots(room.id)}
                  className="slots-toggle-btn"
                >
                  {slotsByRoom[room.id] ? 'Приховати слоти' : 'Показати слоти'}
                </button>

                {loadingSlots[room.id] && (
                  <p className="loading-slots">Loading slots…</p>
                )}
                {errorSlots[room.id] && (
                  <p className="error-slots">Error: {errorSlots[room.id]}</p>
                )}

                {slotsByRoom[room.id] && (
                  <div className="slots-list-container">
                    <SlotsList slots={slotsByRoom[room.id]} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-rooms">Немає кімнат цього типу.</p>
          )}
        </div>
      </div>
    </div>
  );
}
