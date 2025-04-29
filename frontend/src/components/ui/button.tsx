import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = props => (
  <button
    {...props}
    style={{
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: 4,
      padding: '0.5rem 1rem',
      cursor: 'pointer'
    }}
  >
    {props.children}
  </button>
);
