import { Router } from 'express';
import {
  getUsers,
  getUserById,
  deleteUser
} from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware, requireAdmin);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

export default router;
