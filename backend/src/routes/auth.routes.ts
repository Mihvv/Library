import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { validateDto } from '../middlewares/validation.middleware';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';

const router = Router();

router.post('/register', validateDto(RegisterDto), register);
router.post('/login', validateDto(LoginDto), login);

export default router;