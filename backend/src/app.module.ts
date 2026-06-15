import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UrlModule } from './url/url.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UrlModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
