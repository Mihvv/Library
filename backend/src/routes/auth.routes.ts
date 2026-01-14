import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { validateDto } from '../middlewares/validation.middleware.js';
import { LoginDto, RegisterDto } from '../dtos/auth.dto.js';

const router = Router();

router.post('/register', validateDto(RegisterDto), register);
router.post('/login', validateDto(LoginDto), login);

export default router;