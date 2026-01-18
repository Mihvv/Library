export type Role = 'USER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  role: Role;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  isAvailable?: boolean;
}

export interface Loan {
  id: number;
  userId: number;
  bookId: number;
  borrowedAt: string;
  returnDate: string | null;
  book: Book;
  user?: {
    id: number;
    email: string;
  };
}

export interface PaginatedBooks {
  data: Book[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}