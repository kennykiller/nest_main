import { Injectable } from '@nestjs/common';
import {
  ISqlBuilder,
  SqlSelectOptions,
} from './interfaces/mysql.builder.interface';

@Injectable()
export class MySqlBuilderService implements ISqlBuilder {
  buildInsert(
    table: string,
    data: Record<string, any>,
  ): { query: string; params: any[] } {
    const columns = Object.keys(data);
    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(data);

    const query = `
      INSERT INTO ${table} (${columns.join(', ')})
      VALUES (${placeholders})
    `;

    return { query, params: values };
  }

  buildUpdate(
    table: string,
    updateData: Record<string, any>,
    where: Record<string, any>,
  ): { query: string; params: any[] } {
    const setClauses = Object.keys(updateData).map((key) => `${key} = ?`);
    const whereClauses = Object.keys(where).map((key) => `${key} = ?`);

    const query = `
      UPDATE ${table}
      SET ${setClauses.join(', ')}
      WHERE ${whereClauses.join(' AND ')}
    `;

    const params = [...Object.values(updateData), ...Object.values(where)];

    return { query, params };
  }

  buildSelect(
    table: string,
    where?: Record<string, any>,
    options?: SqlSelectOptions,
  ): { query: string; params: any[] } {
    let query = `SELECT * FROM ${table}`;

    const params: any[] = [];
    const whereClauses = [];

    if (where) {
      for (const key in where) {
        whereClauses.push(`${key} = ?`);
        params.push(where[key]);
      }
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    if (options) {
      const { limit, offset, orderBy, orderDirection } = options;

      if (orderBy && ['ASC', 'DESC'].includes(orderDirection)) {
        query += ` ORDER BY ${orderBy} ${orderDirection}`;
      }

      if (limit) {
        query += ` LIMIT ${limit}`;
      }

      if (offset) {
        query += ` OFFSET ${offset}`;
      }
    }

    return { query, params };
  }

  buildDelete(
    table: string,
    where: Record<string, any>,
  ): { query: string; params: any[] } {
    const whereClauses = Object.keys(where).map((key) => `${key} = ?`);
    const params = Object.values(where);

    const query = `
      DELETE FROM ${table}
      WHERE ${whereClauses.join(' AND ')}
    `;

    return { query, params };
  }
}
