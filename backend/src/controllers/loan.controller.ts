import { Response } from 'express';
import { prisma } from '../prisma/client';
import { AuthRequest } from '../middlewares/auth.middleware';

export async function createLoan(req: AuthRequest, res: Response) {
  const { bookId } = req.body;
  const userId = req.user.id;

  if (!bookId) {
    return res.status(400).json({ message: 'bookId is required' });
  }

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const activeLoan = await prisma.loan.findFirst({
    where: {
      bookId,
      returnDate: null
    }
  });

  if (activeLoan) {
    return res.status(409).json({ message: 'Book is already loaned' });
  }

  const loan = await prisma.loan.create({
    data: {
      bookId,
      userId
    },
    include: {
      book: true
    }
  });

  res.status(201).json(loan);
}

export async function returnLoan(req: AuthRequest, res: Response) {
  const loanId = Number(req.params.id);
  if (isNaN(loanId)) {
    return res.status(400).json({ message: 'Invalid loan id' });
  }

  const loan = await prisma.loan.findUnique({
    where: { id: loanId }
  });

  if (!loan) {
    return res.status(404).json({ message: 'Loan not found' });
  }

  if (loan.returnDate) {
    return res.status(400).json({ message: 'Book already returned' });
  }

  if (loan.userId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const updated = await prisma.loan.update({
    where: { id: loanId },
    data: { returnDate: new Date() },
    include: {
      book: true
    }
  });

  res.json(updated);
}

export async function getMyLoans(req: AuthRequest, res: Response) {
  const loans = await prisma.loan.findMany({
    where: { userId: req.user.id },
    include: {
      book: true
    },
    orderBy: { borrowedAt: 'desc' }
  });

  res.json(loans);
}

export async function getAllLoans(req: AuthRequest, res: Response) {
  const loans = await prisma.loan.findMany({
    include: {
      user: {
        select: { id: true, email: true }
      },
      book: true
    },
    orderBy: { borrowedAt: 'desc' }
  });

  res.json(loans);
}
