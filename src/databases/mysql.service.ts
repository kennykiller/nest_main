import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { databaseConfig } from '../configs/databases/main-mysql.config';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class MySqlService {
  private pool: mysql.Pool;

  constructor(private logger: LoggerService) {
    this.pool = mysql.createPool({
      ...databaseConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async query(sql: string, params?: any[]) {
    try {
      const [rows] = await this.pool.query(sql, params);
      return rows;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
