import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';

@Injectable()
export class AnalyticsMiddleware implements NestMiddleware {
  constructor(private readonly analytics: AnalyticsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method } = req;
    const path = (req as any)._parsedUrl.pathname; // например: /cats/123 → /cats/123

    // Заменяем ID на :id → /cats/123 → /cats/:id
    const normalizedPath = this.normalizeRoute(path);

    const routeKey = `${method}:${normalizedPath}`;
    this.analytics.updateCounter(routeKey);

    next();
  }

  private normalizeRoute(path: string): string {
    return path
      .split('/')
      .map((part) =>
        /^\d+$/.test(part)
          ? ':id'
          : part.startsWith(':') // например, /cats/:id → остаётся как есть
            ? part
            : part,
      )
      .join('/');
  }
}
