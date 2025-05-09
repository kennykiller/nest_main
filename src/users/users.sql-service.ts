import { Injectable } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { MySqlService } from '../databases/mysql.service';
import { join } from 'path';

@Injectable()
export class UsersSqlService {
  private basePathForUsersSql = join(process.cwd(), 'sql-queries', 'users');

  constructor(private mysqlService: MySqlService) {}

  async getUsers(params: any[] = [1]) {
    const filePath = join(this.basePathForUsersSql, 'get-users.sql');
    console.log(filePath);

    const file = await readFile(filePath, { encoding: 'utf-8' });
    return this.mysqlService.query(file, params);
  }
}
