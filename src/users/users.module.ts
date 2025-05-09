import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabasesModule } from '../databases/databases.module';
import { UsersSqlService } from './users.sql-service';
import { UsersQueriesService } from './users.queries.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [DatabasesModule, LoggerModule],
  controllers: [UsersController],
  providers: [UsersService, UsersSqlService, UsersQueriesService],
})
export class UsersModule {}
