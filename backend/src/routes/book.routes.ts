import { Router } from 'express';
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
} from '../controllers/book.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { CreateBookDto, UpdateBookDto } from '../dtos/book.dto';

const router = Router();

router.get('/', authMiddleware, getBooks);
router.get('/:id', authMiddleware, getBookById);

router.post('/', authMiddleware, requireAdmin, validateDto(CreateBookDto), createBook);
router.put('/:id', authMiddleware, requireAdmin, validateDto(UpdateBookDto), updateBook);
router.delete('/:id', authMiddleware, requireAdmin, deleteBook);

export default router;