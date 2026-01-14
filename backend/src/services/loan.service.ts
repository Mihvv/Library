import { prisma } from '../prisma/client.js';
import { CreateLoanDto, LoanResponseDto } from '../dtos/loan.dto.js';

export class LoanService {
  async createLoan(userId: number, dto: CreateLoanDto): Promise<LoanResponseDto> {
    const book = await prisma.book.findUnique({
      where: { id: dto.bookId }
    });

    if (!book) {
      throw new Error('Book not found');
    }

    const activeLoan = await prisma.loan.findFirst({
      where: {
        bookId: dto.bookId,
        returnDate: null
      }
    });

    if (activeLoan) {
      throw new Error('Book is already loaned');
    }

    const loan = await prisma.loan.create({
      data: {
        bookId: dto.bookId,
        userId
      },
      include: {
        book: true
      }
    });

    return loan;
  }

  async returnLoan(loanId: number, userId: number, userRole: string): Promise<LoanResponseDto> {
    const loan = await prisma.loan.findUnique({
      where: { id: loanId }
    });

    if (!loan) {
      throw new Error('Loan not found');
    }

    if (loan.returnDate) {
      throw new Error('Book already returned');
    }

    if (loan.userId !== userId && userRole !== 'ADMIN') {
      throw new Error('Forbidden');
    }

    const updatedLoan = await prisma.loan.update({
      where: { id: loanId },
      data: { returnDate: new Date() },
      include: {
        book: true
      }
    });

    return updatedLoan;
  }

  async getUserLoans(userId: number): Promise<LoanResponseDto[]> {
    const loans = await prisma.loan.findMany({
      where: { userId },
      include: {
        book: true
      },
      orderBy: { borrowedAt: 'desc' }
    });

    return loans;
  }

  async getAllLoans(): Promise<LoanResponseDto[]> {
    const loans = await prisma.loan.findMany({
      include: {
        user: {
          select: { id: true, email: true }
        },
        book: true
      },
      orderBy: { borrowedAt: 'desc' }
    });

    return loans;
  }
}

export const loanService = new LoanService();