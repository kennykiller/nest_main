import { Module } from '@nestjs/common';
import { MySqlService } from './mysql.service';
import { LoggerModule } from '../logger/logger.module';
import { MySqlLoaderService } from './mysql.loader.service';
import { MySqlBuilderService } from './mysql.builder.service';

@Module({
  imports: [LoggerModule],
  providers: [MySqlService, MySqlLoaderService, MySqlBuilderService],
  exports: [MySqlService, MySqlLoaderService, MySqlBuilderService],
})
export class DatabasesModule {}
