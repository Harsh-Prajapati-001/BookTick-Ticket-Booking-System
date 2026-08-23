import { Router } from 'express';
import { createVenue, generateLayout, getVenues } from '../controllers/venueController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getVenues as any);
router.post('/', requireAuth as any, requireRole(['ADMIN']) as any, createVenue as any);
router.post('/:id/layout', requireAuth as any, requireRole(['ADMIN']) as any, generateLayout as any);

export default router;
