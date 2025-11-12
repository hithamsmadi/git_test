import { Router } from 'express';
import { requireRole } from '../middleware/role.js';
import prisma from '../prisma.js';

const router = Router();

router.get('/', requireRole(['ADMIN']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, username: true, role: true } });
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users', error);
    res.status(500).json({ message: 'Unable to fetch users' });
  }
});

export default router;
