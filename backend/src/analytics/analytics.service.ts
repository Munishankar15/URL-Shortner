import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUrlAnalytics(userId: string, urlId: string) {
    const url = await this.prisma.url.findUnique({
      where: { id: urlId },
      include: {
        visits: {
          orderBy: { visitedAt: 'desc' },
        },
      },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    if (url.userId !== userId) {
      throw new ForbiddenException('Unauthorized: You do not own this URL');
    }

    const totalClicks = url.clickCount;
    const lastVisited = url.visits.length > 0 ? url.visits[0].visitedAt : null;

    // Get the 10 most recent visits
    const recentVisits = url.visits.slice(0, 10).map((v) => ({
      id: v.id,
      visitedAt: v.visitedAt,
      browser: v.browser,
      device: v.device,
      referrer: v.referrer,
    }));

    // Group visits
    const browserMap: Record<string, number> = {};
    const deviceMap: Record<string, number> = {};
    const referrerMap: Record<string, number> = {};
    const timelineMap: Record<string, number> = {};
    
    // Initialize 24 hourly buckets
    const hourlyMap: Record<number, number> = {};
    for (let i = 0; i < 24; i++) {
      hourlyMap[i] = 0;
    }

    url.visits.forEach((visit) => {
      const browser = visit.browser || 'Unknown';
      browserMap[browser] = (browserMap[browser] || 0) + 1;

      const device = visit.device || 'Desktop';
      deviceMap[device] = (deviceMap[device] || 0) + 1;

      const referrer = visit.referrer || 'Direct';
      referrerMap[referrer] = (referrerMap[referrer] || 0) + 1;

      const dateStr = visit.visitedAt.toISOString().split('T')[0];
      timelineMap[dateStr] = (timelineMap[dateStr] || 0) + 1;

      const hour = visit.visitedAt.getHours(); // Local browser hour
      hourlyMap[hour] = (hourlyMap[hour] || 0) + 1;
    });

    const browserBreakdown = Object.entries(browserMap).map(([name, value]) => ({
      name,
      value,
    }));

    const deviceBreakdown = Object.entries(deviceMap).map(([name, value]) => ({
      name,
      value,
    }));

    const referrerBreakdown = Object.entries(referrerMap)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);

    const hourlyBreakdown = Object.entries(hourlyMap).map(([hour, count]) => ({
      hour: parseInt(hour, 10),
      count,
    }));

    const clickHistory = Object.entries(timelineMap)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      url: {
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: url.shortUrl,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
        maxClicks: url.maxClicks,
        clickCount: url.clickCount,
        tags: url.tags,
      },
      analytics: {
        totalClicks,
        lastVisited,
        recentVisits,
        clickHistory,
        browserBreakdown,
        deviceBreakdown,
        referrerBreakdown,
        hourlyBreakdown,
      },
    };
  }

  async exportVisitsCsv(userId: string, urlId: string): Promise<string> {
    const url = await this.prisma.url.findUnique({
      where: { id: urlId },
      include: {
        visits: {
          orderBy: { visitedAt: 'desc' },
        },
      },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    if (url.userId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    let csv = 'Visited At,Browser,Device,Referrer\n';
    url.visits.forEach((v) => {
      const dateStr = v.visitedAt.toISOString();
      const browser = v.browser || 'Unknown';
      const device = v.device || 'Desktop';
      const referrer = v.referrer || 'Direct';
      csv += `"${dateStr}","${browser}","${device}","${referrer}"\n`;
    });

    return csv;
  }
}
