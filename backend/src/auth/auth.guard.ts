import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

// Global in-memory rate limit store for API keys
// Key: keyHash, Value: Array of request timestamps
const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    // 1. Check if utilizing API Key authentication
    if (apiKey) {
      const keyStr = Array.isArray(apiKey) ? apiKey[0] : apiKey;
      const keyHash = crypto.createHash('sha256').update(keyStr).digest('hex');

      const apiKeyRecord = await this.prisma.apiKey.findUnique({
        where: { keyHash },
      });

      if (!apiKeyRecord) {
        throw new UnauthorizedException('Invalid API Key');
      }

      // Enforce Rate Limiting
      const now = Date.now();
      let timestamps = rateLimitStore.get(keyHash) || [];
      
      // Filter out timestamps outside the 1 minute window
      timestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
      
      if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
        throw new HttpException('Rate limit exceeded (60 requests/min)', HttpStatus.TOO_MANY_REQUESTS);
      }

      timestamps.push(now);
      rateLimitStore.set(keyHash, timestamps);

      request.user = { id: apiKeyRecord.userId };
      return true;
    }

    // 2. Fallback to standard JWT Authorization header
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token format');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const decoded = this.authService.verifyToken(token);
    request.user = { id: decoded.userId };
    
    return true;
  }
}
