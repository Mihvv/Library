import { Request, Response } from 'express';
import { prisma } from '../prisma/client';

export async function createBook(req: Request, res: Response) {
  const { title, author, isbn } = req.body;

  if (!title || !author || !isbn) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const book = await prisma.book.create({
      data: { title, author, isbn }
    });
    res.status(201).json(book);
  } catch (e: any) {
    if (e.code === 'P2002') {
      return res.status(409).json({ message: 'ISBN already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getBooks(req: Request, res: Response) {
  const books = await prisma.book.findMany({
    orderBy: { title: 'asc' }
  });
  res.json(books);
}

export async function getBookById(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  const book = await prisma.book.findUnique({
    where: { id }
  });

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json(book);
}

export async function updateBook(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { title, author, isbn } = req.body;

  if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  try {
    const book = await prisma.book.update({
      where: { id },
      data: { title, author, isbn }
    });
    res.json(book);
  } catch (e: any) {
    if (e.code === 'P2025') {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (e.code === 'P2002') {
      return res.status(409).json({ message: 'ISBN already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteBook(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  try {
    await prisma.book.delete({ where: { id } });
    res.status(204).send();
  } catch (e: any) {
    if (e.code === 'P2025') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}
