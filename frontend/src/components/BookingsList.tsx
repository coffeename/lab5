import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface Booking {
  id: string;
  slot: {
    startTime: string;
    endTime: string;
    room: {
      id: string;
      name: string;
    };
  } | null;  // слот може бути null, тому захищаємося
}

export default function BookingsList() {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Підвантажуємо бронювання
  const reload = async () => {
    try {
      const res = await axios.get<Booking[]>('/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      reload();
    }
  }, [isAuthenticated]);

  const now = new Date();

  // Відсіюємо ті, в яких немає slot
  const valid = bookings.filter(b => b.slot !== null);

  const active = valid.filter(b => new Date(b.slot!.endTime) >= now);
  const past   = valid.filter(b => new Date(b.slot!.endTime) <  now);

  const cancel = async (id: string) => {
    try {
      await axios.delete(`/bookings/${id}`);
      setBookings(bs => bs.filter(b => b.id !== id));
    } catch (err) {
      console.error('Cancel booking failed', err);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Мої поточні бронювання</h1>
      {active.length === 0 && <p>Немає активних бронювань</p>}
      {active.map(b => (
        <Card key={b.id} style={{ marginBottom: '0.75rem' }}>
          <h3>{b.slot!.room.name}</h3>
          <p>
            {new Date(b.slot!.startTime).toLocaleString()} —{' '}
            {new Date(b.slot!.endTime).toLocaleString()}
          </p>
          <Button onClick={() => cancel(b.id)}>Скасувати</Button>
        </Card>
      ))}

      <h2 style={{ marginTop: '2rem' }}>Мої минулі бронювання</h2>
      {past.length === 0 && <p>Немає минулих бронювань</p>}
      {past.map(b => (
        <Card key={b.id} style={{ marginBottom: '0.75rem', opacity: 0.6 }}>
          <h3>{b.slot!.room.name}</h3>
          <p>
            {new Date(b.slot!.startTime).toLocaleString()} —{' '}
            {new Date(b.slot!.endTime).toLocaleString()}
          </p>
        </Card>
      ))}
    </div>
  );
}