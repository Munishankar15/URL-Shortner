import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UAParser } from 'ua-parser-js';
import * as bcrypt from 'bcryptjs';
import { CreateUrlDto } from './dto/create-url.dto';

@Injectable()
export class UrlService {
  private readonly apiUrl = process.env.API_URL || 'http://localhost:5001';
  private readonly frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  constructor(private readonly prisma: PrismaService) {}

  // Generate a random base62 short code of length 6
  private generateShortCode(length = 6): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Check if alias is valid and unique
  async checkAliasAvailability(alias: string): Promise<boolean> {
    const regex = /^[a-zA-Z0-9_-]+$/;
    if (!regex.test(alias)) {
      return false;
    }
    const existing = await this.prisma.url.findUnique({
      where: { shortCode: alias },
    });
    return !existing;
  }

  async createUrl(userId: string, dto: CreateUrlDto) {
    const { 
      originalUrl, 
      customAlias, 
      expiresAt, 
      password, 
      maxClicks, 
      ogTitle, 
      ogDescription, 
      ogImage, 
      folderId, 
      tags 
    } = dto;

    try {
      new URL(originalUrl);
    } catch {
      throw new BadRequestException('Invalid URL format. Include http:// or https://');
    }

    let shortCode = '';

    if (customAlias) {
      const isAvailable = await this.checkAliasAvailability(customAlias);
      if (!isAvailable) {
        throw new BadRequestException('Alias is invalid or already in use');
      }
      shortCode = customAlias;
    } else {
      let isUnique = false;
      let retries = 5;

      while (!isUnique && retries > 0) {
        shortCode = this.generateShortCode();
        const existing = await this.prisma.url.findUnique({
          where: { shortCode },
        });
        if (!existing) {
          isUnique = true;
        }
        retries--;
      }

      if (!isUnique) {
        throw new InternalServerErrorException('Failed to generate unique short code. Please try again.');
      }
    }

    const shortUrl = `${this.apiUrl}/${shortCode}`;
    
    // Hash password if provided
    let passwordHash: string | null = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const url = await this.prisma.url.create({
      data: {
        userId,
        originalUrl,
        shortCode,
        shortUrl,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        passwordHash,
        maxClicks: maxClicks || null,
        ogTitle: ogTitle || null,
        ogDescription: ogDescription || null,
        ogImage: ogImage || null,
        folderId: folderId || null,
        tags: tags || [],
      },
    });

    return url;
  }

  async listUrls(userId: string, search?: string, folderId?: string, tag?: string) {
    return this.prisma.url.findMany({
      where: {
        userId,
        folderId: folderId === 'all' ? undefined : (folderId || undefined),
        tags: tag ? { has: tag } : undefined,
        OR: search
          ? [
              { originalUrl: { contains: search, mode: 'insensitive' } },
              { shortCode: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteUrl(userId: string, id: string) {
    const url = await this.prisma.url.findUnique({
      where: { id },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    if (url.userId !== userId) {
      throw new ForbiddenException('Unauthorized: You do not own this URL');
    }

    await this.prisma.url.delete({
      where: { id },
    });

    return { success: true };
  }

  // Record visit analytics
  async recordVisit(urlId: string, userAgentString: string | undefined, referer: string | undefined) {
    const parser = new UAParser(userAgentString);
    const browser = parser.getBrowser().name || 'Unknown';
    const deviceCategory = parser.getDevice().type || 'Desktop';
    const device = deviceCategory.charAt(0).toUpperCase() + deviceCategory.slice(1);

    let referrer = 'Direct';
    if (referer) {
      try {
        const hostname = new URL(referer).hostname.toLowerCase();
        if (hostname.includes('google.')) referrer = 'Google';
        else if (hostname.includes('twitter.com') || hostname.includes('t.co') || hostname.includes('x.com')) referrer = 'Twitter';
        else if (hostname.includes('facebook.com')) referrer = 'Facebook';
        else if (hostname.includes('linkedin.com')) referrer = 'LinkedIn';
        else if (hostname.includes('github.com')) referrer = 'GitHub';
        else referrer = hostname.replace('www.', ''); // clean domain
      } catch {
        referrer = 'Other';
      }
    }

    await this.prisma.$transaction([
      this.prisma.url.update({
        where: { id: urlId },
        data: { clickCount: { increment: 1 } },
      }),
      this.prisma.visit.create({
        data: {
          urlId,
          browser,
          device,
          referrer,
        },
      }),
    ]);
  }

  // Handle link redirection checking
  async getRedirectState(shortCode: string) {
    const url = await this.prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url) {
      return { status: 'not_found', originalUrl: null, urlRecord: null };
    }

    // Expiration check
    if (url.expiresAt && new Date() > url.expiresAt) {
      return { status: 'expired', originalUrl: null, urlRecord: url };
    }

    // Click limit check
    if (url.maxClicks && url.clickCount >= url.maxClicks) {
      return { status: 'limit_reached', originalUrl: null, urlRecord: url };
    }

    // Password check
    if (url.passwordHash) {
      return { status: 'password_protected', originalUrl: null, urlRecord: url };
    }

    return { status: 'ok', originalUrl: url.originalUrl, urlRecord: url };
  }

  // Verify password and perform analytics logging
  async verifyPasswordAndRedirect(
    shortCode: string, 
    passwordInput: string, 
    userAgentString: string | undefined,
    referer: string | undefined
  ): Promise<string> {
    const url = await this.prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url || !url.passwordHash) {
      throw new NotFoundException('Password protection not active for this URL');
    }

    const isMatch = await bcrypt.compare(passwordInput, url.passwordHash);
    if (!isMatch) {
      throw new ForbiddenException('Incorrect password');
    }

    // Perform check limits and expiration again just in case
    if (url.expiresAt && new Date() > url.expiresAt) {
      throw new BadRequestException('This URL has expired');
    }
    if (url.maxClicks && url.clickCount >= url.maxClicks) {
      throw new BadRequestException('This URL click limit has been reached');
    }

    // Record click
    await this.recordVisit(url.id, userAgentString, referer);

    return url.originalUrl;
  }

  // Bulk URL shortening
  async bulkShorten(userId: string, csvText: string, folderId?: string, tags?: string[]): Promise<string> {
    const lines = csvText.split(/\r?\n/);
    const results: { originalUrl: string; shortUrl: string }[] = [];

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // Skip common CSV headers
      if (/^(url|original_url|originalurl|long_url|longurl|original url|short url)$/i.test(line)) {
        continue;
      }

      // Clean quotes
      const originalUrl = line.replace(/^["']|["']$/g, '').trim();

      try {
        new URL(originalUrl);
        const urlRecord = await this.createUrl(userId, {
          originalUrl,
          folderId,
          tags,
        });
        results.push({
          originalUrl: urlRecord.originalUrl,
          shortUrl: urlRecord.shortUrl,
        });
      } catch (err) {
        // Skip invalid URL strings but continue bulk processing
      }
    }

    // Convert results to CSV format
    let responseCsv = 'Original URL,Short URL\n';
    results.forEach(row => {
      responseCsv += `"${row.originalUrl}","${row.shortUrl}"\n`;
    });

    return responseCsv;
  }
}
