import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(private readonly prisma: PrismaService) {}

  // Create API Key, hash it with SHA-256, and store
  async createApiKey(userId: string, name: string) {
    const rawKey = `sk_live_${crypto.randomBytes(16).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    await this.prisma.apiKey.create({
      data: {
        userId,
        keyHash,
        name,
      },
    });

    // Return the plain rawKey since it is only displayed once
    return {
      name,
      apiKey: rawKey,
    };
  }

  async listApiKeys(userId: string) {
    const keys = await this.prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Mask key hashes for security before returning
    return keys.map(k => ({
      id: k.id,
      name: k.name,
      createdAt: k.createdAt,
      maskedKey: 'sk_live_••••••••••••' + k.keyHash.substring(k.keyHash.length - 4),
    }));
  }

  async deleteApiKey(userId: string, id: string) {
    const key = await this.prisma.apiKey.findUnique({
      where: { id },
    });

    if (!key) {
      throw new NotFoundException('API Key not found');
    }

    if (key.userId !== userId) {
      throw new ForbiddenException('Unauthorized: You do not own this API key');
    }

    await this.prisma.apiKey.delete({
      where: { id },
    });

    return { success: true };
  }
}
