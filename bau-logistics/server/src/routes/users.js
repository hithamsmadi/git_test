import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireRole } from '../middleware/role.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/', requireRole(['ADMIN']), async (req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, username: true, role: true } });
  res.json(users);
});

export default router;
