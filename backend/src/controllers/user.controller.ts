import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export async function getUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      loans: {
        where: { returnDate: null },
        select: {
          id: true,
          bookId: true,
          borrowedAt: true
        }
      }
    },
    orderBy: { id: 'asc' }
  });

  res.json(users);
}

export async function getUserById(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      loans: {
        include: {
          book: true
        }
      }
    }
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  try {
    await prisma.user.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (e: any) {
    if (e.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}
