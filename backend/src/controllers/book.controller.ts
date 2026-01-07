import { Request, Response } from 'express';
import { bookService } from '../services/book.service';
import { CreateBookDto, UpdateBookDto } from '../dtos/book.dto';

export async function createBook(req: Request, res: Response) {
  try {
    const dto: CreateBookDto = req.body;
    const book = await bookService.createBook(dto);
    res.status(201).json(book);
  } catch (error: any) {
    if (error.message === 'ISBN already exists') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getBooks(req: Request, res: Response) {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getBookById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const book = await bookService.getBookById(id);
    res.json(book);
  } catch (error: any) {
    if (error.message === 'Book not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateBook(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const dto: UpdateBookDto = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const book = await bookService.updateBook(id, dto);
    res.json(book);
  } catch (error: any) {
    if (error.message === 'Book not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'ISBN already exists') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteBook(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    await bookService.deleteBook(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Book not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}