import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('stats')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get(':route')
  getStatsByRoute(@Param('route') route: string) {
    return this.analytics.getCounterByRoute(route);
  }

  @Get()
  getStats() {
    return this.analytics.getAllCounters();
  }
}
