import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;
  const fixedTestRoutes = [
    'GET:/cats/:id',
    'GET:/cats',
    'GET:/cats/:id',
    'POST:/cats',
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsService],
    }).compile();

    analyticsService = module.get<AnalyticsService>(AnalyticsService);
  });

  describe('updateCounters', () => {
    it('should create new key/value pair if it does not exist', () => {
      const emptyObject = analyticsService.getCounterByRoute('GET:/cats/:id');
      expect(emptyObject).toBe(undefined);
      analyticsService.updateCounter('POST:/cats');
      const result = analyticsService.getCounterByRoute('POST:/cats');
      expect(result).toBe(1);
    });

    it('should increment counter for existing key', () => {
      fixedTestRoutes.forEach((el) => analyticsService.updateCounter(el));
      const result = analyticsService.getCounterByRoute('GET:/cats/:id');
      expect(result).toBe(2);
    });
  });

  describe('getAllCounters', () => {
    it('should return empty object', () => {
      const result = analyticsService.getAllCounters();
      expect(result).toEqual({});
    });

    it('should return list of records', () => {
      fixedTestRoutes.forEach((el) => analyticsService.updateCounter(el));
      const result = analyticsService.getAllCounters();
      expect(result).toEqual({
        'GET:/cats/:id': 2,
        'GET:/cats': 1,
        'POST:/cats': 1,
      });
    });
  });

  describe('getCountersByRoute', () => {
    it('should return empty object', () => {
      const result = analyticsService.getCounterByRoute('GET:/cats/:id');
      expect(result).toBe(undefined);
    });

    it('should return found record', () => {
      fixedTestRoutes.forEach((el) => analyticsService.updateCounter(el));
      const result = analyticsService.getCounterByRoute('GET:/cats/:id');
      expect(result).toBe(2);
    });
  });
});
