import React from 'react';

interface Slot {
  id: string;
  start_time: string;
  end_time: string;
}

interface SlotsListProps {
  slots: Slot[];
}

export default function SlotsList({ slots }: SlotsListProps) {
  return (
    <ul>
      {slots.map(slot => (
        <li key={slot.id}>
          {new Date(slot.start_time).toLocaleString('uk-UA', {
             year:   'numeric',
             month:  '2-digit',
             day:    '2-digit',
             hour:   '2-digit',
             minute: '2-digit',
             second: '2-digit',
             timeZone: 'UTC'
          })} —{' '}
          {new Date(slot.end_time).toLocaleString('uk-UA', {
             year:   'numeric',
             month:  '2-digit',
             day:    '2-digit',
             hour:   '2-digit',
             minute: '2-digit',
             second: '2-digit',
             timeZone: 'UTC'
          })} UTC
        </li>
      ))}
    </ul>
  );
}
