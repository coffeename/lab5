import React from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

axios.defaults.baseURL = '/';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);