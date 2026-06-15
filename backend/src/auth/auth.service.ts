import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'super_secret_jwt_key_12345_67890';

  constructor(private readonly prisma: PrismaService) {}

  async signup(dto: SignupDto) {
    const emailLower = dto.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: emailLower,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id);
    return { user, token };
  }

  async login(dto: LoginDto) {
    const emailLower = dto.email.toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, this.jwtSecret, { expiresIn: '7d' });
  }

  verifyToken(token: string): { userId: string } {
    try {
      return jwt.verify(token, this.jwtSecret) as { userId: string };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
