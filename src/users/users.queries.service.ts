import { Injectable, OnModuleInit } from '@nestjs/common';
import { MySqlLoaderService } from '../databases/mysql.loader.service';
import { LoggerService } from '../logger/logger.service';
import { UsersQueries, usersQueriesMap } from './users.queries.map';

const subfolder = 'users';

@Injectable()
export class UsersQueriesService implements OnModuleInit {
  public queriesMap: Record<UsersQueries, string> = {} as any;

  constructor(
    private sqlLoaderService: MySqlLoaderService,
    private logger: LoggerService,
  ) {}

  async onModuleInit() {
    try {
      const entries = Object.entries(usersQueriesMap);

      const loadedQueries = await Promise.all(
        entries.map(async ([key, filename]) => {
          const sql = await this.sqlLoaderService.load(subfolder, filename);
          return [key, sql] as const;
        }),
      );

      this.queriesMap = Object.fromEntries(loadedQueries) as Record<
        UsersQueries,
        string
      >;
    } catch (error) {
      this.logger.error(`Failed to load SQL queries for "${subfolder}"`);
      this.logger.error(error);
      throw error;
    }
  }
}
