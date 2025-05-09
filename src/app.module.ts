import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnalyticsService } from './analytics/analytics.service';
import { AnalyticsController } from './analytics/analytics.controller';
import { CatsModule } from './cats/cats.module';
import { AnalyticsMiddleware } from './analytics/analytics.middleware';
import { AnalyticsModule } from './analytics/analytics.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabasesModule } from './databases/databases.module';

@Module({
  imports: [
    CatsModule,
    AnalyticsModule,
    UsersModule,
    AuthModule,
    DatabasesModule,
  ],
  controllers: [AppController, AnalyticsController],
  providers: [AppService, AnalyticsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AnalyticsMiddleware).forRoutes('*');
  }
}
