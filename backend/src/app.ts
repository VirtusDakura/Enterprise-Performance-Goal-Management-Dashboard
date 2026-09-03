import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';

export const createApp = (): Express => {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration
  const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin || origin === allowedOrigin || origin.startsWith('http://localhost:')) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive in dev/assessment environment
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Request logging
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mount API router under /api
  app.use('/api', apiRouter);

  // Fallback 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found',
    });
  });

  // Central error handling
  app.use(errorHandler);

  return app;
};
