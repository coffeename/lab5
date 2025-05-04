import React, { useState, useEffect } from 'react';
import { useAuth }     from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card }        from './ui/card';
import { Button }      from './ui/button';

export default function Login() {
  const { token, login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [name,       setName]       = useState('');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [message,    setMessage]    = useState<string|null>(null);
  const [error,      setError]      = useState<string|null>(null);
  const [loading,    setLoading]    = useState(false);

  // Як тільки токен зʼявився і ми не на сторінці реєстрації — йдемо на "/"
  useEffect(() => {
    if (token && !isRegister) {
      navigate('/', { replace: true });
    }
  }, [token, isRegister, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password);
        setMessage('🎉 Акаунт створено! Тепер увійдіть у систему.');
        // переключаємось в режим логіну
        setIsRegister(false);
      } else {
        await login(email, password);
        // більше не викликаємо navigate тут
        // воно відбудеться в useEffect, коли token оновиться
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <Card style={{ padding: '2rem' }}>
        <h2>{isRegister ? 'Register' : 'Login'}</h2>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              required
              onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />

          {message && <div style={{ color: 'green', marginBottom: '0.5rem' }}>{message}</div>}
          {error   && <div style={{ color: 'red',   marginBottom: '0.5rem' }}>{error}</div>}

          <Button
            type="submit"
            disabled={loading}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          >
            {loading
              ? 'Please wait...'
              : isRegister
                ? 'Register'
                : 'Login'}
          </Button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <Button
            onClick={() => {
              setIsRegister(r => !r);
              setMessage(null);
              setError(null);
            }}
            style={{
              background: 'none',
              color: '#007bff',
              border: 'none',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            {isRegister
              ? 'Have an account? Login'
              : "Don't have an account? Register"}
          </Button>
        </div>
      </Card>
    </div>
  );
}