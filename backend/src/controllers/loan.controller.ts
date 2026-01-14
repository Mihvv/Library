import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { loanService } from '../services/loan.service.js';
import { CreateLoanDto } from '../dtos/loan.dto.js';

export async function createLoan(req: AuthRequest, res: Response) {
  try {
    const dto: CreateLoanDto = req.body;
    const loan = await loanService.createLoan(req.user.id, dto);
    res.status(201).json(loan);
  } catch (error: any) {
    if (error.message === 'Book not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Book is already loaned') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function returnLoan(req: AuthRequest, res: Response) {
  try {
    const loanId = Number(req.params.id);
    
    if (isNaN(loanId)) {
      return res.status(400).json({ message: 'Invalid loan id' });
    }

    const loan = await loanService.returnLoan(
      loanId,
      req.user.id,
      req.user.role
    );
    
    res.json(loan);
  } catch (error: any) {
    if (error.message === 'Loan not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Book already returned') {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === 'Forbidden') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getMyLoans(req: AuthRequest, res: Response) {
  try {
    const loans = await loanService.getUserLoans(req.user.id);
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getAllLoans(req: AuthRequest, res: Response) {
  try {
    const loans = await loanService.getAllLoans();
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}