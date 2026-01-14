import { prisma } from '../prisma/client.js';
import { UserListItemDto, UserResponseDto } from '../dtos/user.dto.js';

export class UserService {
  async getAllUsers(): Promise<UserListItemDto[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        loans: {
          where: { returnDate: null },
          select: {
            id: true,
            bookId: true,
            borrowedAt: true
          }
        }
      },
      orderBy: { id: 'asc' }
    });

    return users;
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        loans: {
          include: {
            book: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await prisma.user.delete({
        where: { id }
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error('User not found');
      }
      throw error;
    }
  }
}

export const userService = new UserService();