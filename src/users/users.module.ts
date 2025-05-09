import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabasesModule } from '../databases/databases.module';
import { UsersSqlService } from './users.sql-service';

@Module({
  imports: [DatabasesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersSqlService],
})
export class UsersModule {}
