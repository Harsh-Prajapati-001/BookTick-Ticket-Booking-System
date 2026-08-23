import { Router } from 'express';
import { register, login, logout } from '../controllers/authController';
import { requireAuth, AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router = Router();

router.post('/register', register as any);
router.post('/login', login as any);
router.post('/logout', logout as any);
router.get('/me', requireAuth as any, async (req: AuthRequest, res) => {
  const user = await User.findById(req.user?.userId).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

export default router;
