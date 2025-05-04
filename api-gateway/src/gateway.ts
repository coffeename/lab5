import 'dotenv/config';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';

const app = express();
const port = process.env.PORT ? +process.env.PORT : 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// health check
app.get('/health', (_req, res) => res.sendStatus(200));

// JWT middleware
app.use((req, _res, next) => {
  const auth = req.headers.authorization as string | undefined;
  if (auth?.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(auth.slice(7), JWT_SECRET) as any;
      req.headers['x-user-id'] = payload.sub;
      req.headers['x-user-role'] = payload.role;
    } catch (err: any) {
      console.warn('Invalid JWT:', err.message);
    }
  }
  next();
});

app.use((req, res, next) => {
  console.log('🔶 GW: incoming', req.method, req.url, '⇢ auth:', req.headers.authorization, '⇢ x-user-id:', req.headers['x-user-id']);
  next();
});

// Auth proxy
app.use('/auth',
  createProxyMiddleware({
    target: 'http://user-service:3000',
    changeOrigin: true,
    pathRewrite: { '^/auth': '/auth' },
  }),
);

// Users proxy
app.use('/users',
  createProxyMiddleware({
    target: 'http://user-service:3000',
    changeOrigin: true,
    pathRewrite: { '^/users': '/users' },
  }),
);

// Rooms proxy
app.use('/rooms',
  createProxyMiddleware({
    target: 'http://room-service:3002',
    changeOrigin: true,
  }),
);

// Bookings proxy with forwarded headers
app.use('/bookings',
  createProxyMiddleware({
    target: 'http://booking-service:3003',
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      const uid = req.headers['x-user-id'] as string | undefined;
      if (uid) proxyReq.setHeader('x-user-id', uid);
      const role = req.headers['x-user-role'] as string | undefined;
      if (role) proxyReq.setHeader('x-user-role', role);
    },
  }),
);

app.listen(port, () =>
  console.log(`API Gateway running on http://localhost:${port}`),
);