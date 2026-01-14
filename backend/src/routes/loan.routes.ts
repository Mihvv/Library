import { Router } from 'express';
import {
  createLoan,
  returnLoan,
  getMyLoans,
  getAllLoans
} from '../controllers/loan.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';
import { validateDto } from '../middlewares/validation.middleware.js';
import { CreateLoanDto } from '../dtos/loan.dto.js';

const router = Router();

router.post('/', authMiddleware, validateDto(CreateLoanDto), createLoan);
router.put('/:id/return', authMiddleware, returnLoan);
router.get('/me', authMiddleware, getMyLoans);
router.get('/', authMiddleware, requireAdmin, getAllLoans);

export default router;