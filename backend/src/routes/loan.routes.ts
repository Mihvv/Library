import { Router } from 'express';
import {
  createLoan,
  returnLoan,
  getMyLoans,
  getAllLoans
} from '../controllers/loan.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { CreateLoanDto } from '../dtos/loan.dto';

const router = Router();

router.post('/', authMiddleware, validateDto(CreateLoanDto), createLoan);
router.put('/:id/return', authMiddleware, returnLoan);
router.get('/me', authMiddleware, getMyLoans);
router.get('/', authMiddleware, requireAdmin, getAllLoans);

export default router;