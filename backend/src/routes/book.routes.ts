import { Router } from 'express';
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
} from '../controllers/book.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';
import { validateDto } from '../middlewares/validation.middleware.js';
import { CreateBookDto, UpdateBookDto } from '../dtos/book.dto.js';

const router = Router();

router.get('/', getBooks);
router.get('/:id', getBookById);

router.post('/', authMiddleware, requireAdmin, validateDto(CreateBookDto), createBook);
router.put('/:id', authMiddleware, requireAdmin, validateDto(UpdateBookDto), updateBook);
router.delete('/:id', authMiddleware, requireAdmin, deleteBook);

export default router;