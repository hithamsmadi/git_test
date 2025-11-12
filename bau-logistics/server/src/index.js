import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import { verifyToken } from './middleware/auth.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', verifyToken, userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = Number.parseInt(process.env.PORT ?? '3001', 10);

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Authentication will fail until it is configured.');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
