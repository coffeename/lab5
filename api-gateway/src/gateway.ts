import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.get('/health', (_req, res) => res.sendStatus(200));

app.use(
  '/users',
  createProxyMiddleware({ target: 'http://user-service:3000', changeOrigin: true })
);

app.use(
  '/rooms',
  createProxyMiddleware({ target: 'http://room-service:3002', changeOrigin: true })
);

app.use(
  '/bookings',
  createProxyMiddleware({ target: 'http://booking-service:3003', changeOrigin: true })
);

const port = process.env.PORT ? +process.env.PORT : 3001;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
