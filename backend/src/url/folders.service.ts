import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FoldersService {
  constructor(private readonly prisma: PrismaService) {}

  async createFolder(userId: string, name: string) {
    return this.prisma.folder.create({
      data: {
        userId,
        name,
      },
    });
  }

  async listFolders(userId: string) {
    return this.prisma.folder.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { urls: true },
        },
      },
    });
  }

  async deleteFolder(userId: string, id: string) {
    const folder = await this.prisma.folder.findUnique({
      where: { id },
    });

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    if (folder.userId !== userId) {
      throw new ForbiddenException('Unauthorized: You do not own this folder');
    }

    await this.prisma.folder.delete({
      where: { id },
    });

    return { success: true };
  }
}
