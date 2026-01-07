import { Router } from 'express';
import {
  createLoan,
  returnLoan,
  getMyLoans,
  getAllLoans
} from '../controllers/loan.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

router.post('/', authMiddleware, createLoan);
router.put('/:id/return', authMiddleware, returnLoan);
router.get('/me', authMiddleware, getMyLoans);
router.get('/', authMiddleware, requireAdmin, getAllLoans);

export default router;
