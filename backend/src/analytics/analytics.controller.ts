import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('api/urls')
@UseGuards(AuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(':id/analytics')
  async getUrlAnalytics(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    const result = await this.analyticsService.getUrlAnalytics(user.id, id);
    return {
      success: true,
      data: result,
    };
  }

  @Get(':id/analytics/export')
  async exportAnalytics(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    const csvContent = await this.analyticsService.exportVisitsCsv(user.id, id);
    return {
      success: true,
      csv: csvContent,
    };
  }
}
