import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { LoggerModule } from '../logger/logger.module';

@Module({
  providers: [CatsService],
  controllers: [CatsController],
  imports: [LoggerModule],
})
export class CatsModule {}
