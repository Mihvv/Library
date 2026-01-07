import { prisma } from '../prisma/client';
import { CreateBookDto, UpdateBookDto, BookResponseDto } from '../dtos/book.dto';

export class BookService {
  async createBook(dto: CreateBookDto): Promise<BookResponseDto> {
    try {
      const book = await prisma.book.create({
        data: {
          title: dto.title,
          author: dto.author,
          isbn: dto.isbn
        }
      });

      return book;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('ISBN already exists');
      }
      throw error;
    }
  }

  async getAllBooks(): Promise<BookResponseDto[]> {
    const books = await prisma.book.findMany({
      orderBy: { title: 'asc' }
    });

    return books;
  }

  async getBookById(id: number): Promise<BookResponseDto> {
    const book = await prisma.book.findUnique({
      where: { id }
    });

    if (!book) {
      throw new Error('Book not found');
    }

    return book;
  }

  async updateBook(id: number, dto: UpdateBookDto): Promise<BookResponseDto> {
    try {
      const book = await prisma.book.update({
        where: { id },
        data: dto
      });

      return book;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error('Book not found');
      }
      if (error.code === 'P2002') {
        throw new Error('ISBN already exists');
      }
      throw error;
    }
  }

  async deleteBook(id: number): Promise<void> {
    try {
      await prisma.book.delete({
        where: { id }
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error('Book not found');
      }
      throw error;
    }
  }
}

export const bookService = new BookService();