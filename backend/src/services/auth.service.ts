import bcrypt from 'bcrypt';
import { prisma } from '../prisma/client';
import { signToken } from '../utils/jwt';
import { RegisterDto, LoginDto, AuthResponseDto } from '../dtos/auth.dto';
import { UserResponseDto } from '../dtos/user.dto';

export class AuthService {
  async register(dto: RegisterDto): Promise<UserResponseDto> {
    const existingUser = await prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword
      }
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = signToken({ id: user.id, role: user.role });

    return { token };
  }
}

export const authService = new AuthService();