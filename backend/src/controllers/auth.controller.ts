import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma/client';
import { signToken } from '../utils/jwt';

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed }
  });

  res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken({ id: user.id, role: user.role });
  res.json({ token });
}
