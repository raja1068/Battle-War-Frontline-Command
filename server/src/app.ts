import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import missionRoutes from './routes/mission';
import shopRoutes from './routes/shop';
import paymentRoutes from './routes/payment';
import adminRoutes from './routes/admin';
import webhookRoutes from './routes/webhook';
import { authenticate } from './middleware/auth';
import { errorHandler } from './middleware/error';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authenticate, userRoutes);
app.use('/api/missions', authenticate, missionRoutes);
app.use('/api/shop', authenticate, shopRoutes);
app.use('/api/payment', authenticate, paymentRoutes);
app.use('/api/admin', authenticate, adminRoutes);
app.use('/webhook', webhookRoutes);

app.use(errorHandler);

// DB connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
