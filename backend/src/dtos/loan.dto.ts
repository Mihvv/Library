import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateLoanDto {
  @IsInt({ message: 'Book ID must be an integer' })
  @IsPositive({ message: 'Book ID must be positive' })
  @IsNotEmpty({ message: 'Book ID is required' })
  bookId!: number;
}

export interface LoanResponseDto {
  id: number;
  userId: number;
  bookId: number;
  borrowedAt: Date;
  returnDate: Date | null;
  book?: {
    id: number;
    title: string;
    author: string;
    isbn: string;
  };
  user?: {
    id: number;
    email: string;
  };
}