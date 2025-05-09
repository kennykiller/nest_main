export class AnalyticsService {
  private routesCounterMap: Record<string, number> = {};

  updateCounter(route: string) {
    if (this.routesCounterMap[route] > 0) {
      this.routesCounterMap[route]++;
    } else {
      this.routesCounterMap[route] = 1;
    }
  }

  getCounterByRoute(route: string): number | undefined {
    return this.routesCounterMap[route];
  }

  getAllCounters() {
    return this.routesCounterMap;
  }
}
