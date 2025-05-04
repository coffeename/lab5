import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import PrivateRoute from './routes/PrivateRoute';
import RoomsList from './components/RoomsList';
import SlotsList from './components/SlotsList';
import BookingsList from './components/BookingsList';

function App() {
  return (
    <BrowserRouter>
      {/* навігаційна панель завжди зверху */}
      <Navbar />

      <Routes>
        {/* 1) Логін/реєстрація */}
        <Route path="/login" element={<Login />} />

        {/* 2) Приватні маршрути */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<RoomsList />} />
          <Route path="/rooms/:roomId/slots" element={<SlotsList />} />
          <Route path="/bookings" element={<BookingsList />} />
        </Route>

        {/* 3) Все інше → /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;