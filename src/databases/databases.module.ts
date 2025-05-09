import { Module } from '@nestjs/common';
import { MySqlService } from './mysql.service';
import { LoggerModule } from '../logger/logger.module';
import { MySqlLoaderService } from './mysql.loader.service';

@Module({
  imports: [LoggerModule],
  providers: [MySqlService, MySqlLoaderService],
  exports: [MySqlService, MySqlLoaderService],
})
export class DatabasesModule {}
