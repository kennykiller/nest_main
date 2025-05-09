import { Module } from '@nestjs/common';
import { AnalyticsMiddleware } from './analytics.middleware';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

@Module({
  providers: [AnalyticsMiddleware, AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsMiddleware],
})
export class AnalyticsModule {}
