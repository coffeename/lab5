import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Якщо не аутентифікований — навбар не показуємо
  if (!isAuthenticated) return null;

  return (
    <nav style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <NavLink
        to="/"
        style={({ isActive }) => ({
          marginRight: '1rem',
          textDecoration: 'none',
          color: isActive ? '#007bff' : '#000',
          fontWeight: isActive ? 'bold' : 'normal',
        })}
      >
        Rooms
      </NavLink>

      <NavLink
        to="/bookings"
        style={({ isActive }) => ({
          marginRight: '1rem',
          textDecoration: 'none',
          color: isActive ? '#007bff' : '#000',
          fontWeight: isActive ? 'bold' : 'normal',
        })}
      >
        My Bookings
      </NavLink>

      <button
        onClick={handleLogout}
        style={{
          marginLeft: 'auto',
          background: 'transparent',
          border: 'none',
          color: '#007bff',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        Logout
      </button>
    </nav>
  );
}
