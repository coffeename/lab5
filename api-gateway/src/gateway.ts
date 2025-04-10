import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use(
  '/users',
  createProxyMiddleware({
    target: 'http://localhost:3000', // порт User Service
    changeOrigin: true,
  }),
);

app.use(
  '/rooms',
  createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
  }),
);

app.use(
  '/bookings',
  createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true,
  }),
);


app.listen(3001, () => {
  console.log('API Gateway running on port 3001');
});

