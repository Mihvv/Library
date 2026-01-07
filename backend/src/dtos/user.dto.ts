export interface UserResponseDto {
  id: number;
  email: string;
  role: string;
  loans?: Array<{
    id: number;
    bookId: number;
    borrowedAt: Date;
    returnDate?: Date | null;
    book?: {
      id: number;
      title: string;
      author: string;
      isbn: string;
    };
  }>;
}

export interface UserListItemDto {
  id: number;
  email: string;
  role: string;
  loans: Array<{
    id: number;
    bookId: number;
    borrowedAt: Date;
  }>;
}