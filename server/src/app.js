import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import hpp from 'hpp';
import morgan from 'morgan';

import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import metaRoutes from './routes/metaRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

export const app = express();

// Trust proxy for reverse proxies (Render, Railway, Fly.io, Vercel)
app.set('trust proxy', 1);

// Security & Parsing Middleware
app.use(helmet());

// Flexible CORS supporting local dev, any Vercel preview/production domain, and configured origins
const rawOrigins = [
  env.CORS_ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

const configuredOrigins = [];
rawOrigins.forEach(origin => {
  if (typeof origin === 'string' && origin.includes(',')) {
    origin.split(',').forEach(o => configuredOrigins.push(o.trim()));
  } else {
    configuredOrigins.push(origin);
  }
});

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (curl, server-to-server, health probes)
    if (!origin) return callback(null, true);

    // Allow explicitly configured origins
    if (configuredOrigins.includes(origin)) return callback(null, true);

    // Allow any Vercel domain (*.vercel.app)
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true);

    // Allow localhost/127.0.0.1 on any port
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return callback(null, true);

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(compression());
app.use(hpp());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Global API rate limit
app.use('/api', apiLimiter);

// API v1 Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/meta', metaRoutes);
app.use('/api/v1/skills', skillRoutes);
app.use('/api/v1/role', roleRoutes);
app.use('/api/v1/analysis', analysisRoutes);
app.use('/api/v1/roadmap', roadmapRoutes);
app.use('/api/v1/resume', resumeRoutes);
app.use('/api/v1/report', reportRoutes);
app.use('/api/v1/interview', interviewRoutes);
app.use('/api/v1/verify', verificationRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Fallback 404 & Central Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

