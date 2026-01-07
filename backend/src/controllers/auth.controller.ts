import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';

export async function register(req: Request, res: Response) {
  try {
    const dto: RegisterDto = req.body;
    const user = await authService.register(dto);
    res.status(201).json(user);
  } catch (error: any) {
    if (error.message === 'Email already exists') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const dto: LoginDto = req.body;
    const result = await authService.login(dto);
    res.json(result);
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}