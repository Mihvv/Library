import { prisma } from '../prisma/client';
import { 
  CreateBookDto, 
  UpdateBookDto, 
  BookResponseDto, 
  GetBooksQueryDto,
  PaginatedBooksResponseDto 
} from '../dtos/book.dto.js';

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

  async getAllBooks(query: GetBooksQueryDto): Promise<PaginatedBooksResponseDto> {
    const { page = 1, limit = 10, search, sortBy = 'title', order = 'asc' } = query;
    
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { author: { contains: search, mode: 'insensitive' as const } },
        { isbn: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
          loans: {
            where: {
              returnDate: null
            },
            select: {
              id: true
            }
          }
        }
      }),
      prisma.book.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    const booksAvail = books.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      isAvailable: book.loans.length === 0
    }));

    return {
      data: booksAvail,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
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