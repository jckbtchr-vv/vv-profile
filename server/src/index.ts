import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 4000;

app.use(cors());

// Stripe webhook needs raw body
app.use('/api/subscription/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Import routes
import authRoutes from './routes/auth';
import quizRoutes from './routes/quiz';
import subscriptionRoutes from './routes/subscription';
// import profileRoutes from './routes/profile';

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/subscription', subscriptionRoutes);
// app.use('/api/profile', profileRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { prisma };

