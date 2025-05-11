import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ISqlBuilder,
  SqlWhereConditions,
  PercentageTypes,
  SqlSelectOptions,
  ISqlBuilderResult,
} from './interfaces/mysql.builder.interface';

@Injectable()
export class MySqlBuilderService implements ISqlBuilder {
  buildInsert(table: string, data: Record<string, any>): ISqlBuilderResult {
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
    where: SqlWhereConditions,
  ): ISqlBuilderResult {
    const setClauses = Object.keys(updateData).map((key) => `${key} = ?`);
    const setParams = Object.values(updateData);
    const whereClauses: string[] = [];
    const whereParams: any[] = [];

    this.whereConstructor(where, whereClauses, whereParams);

    const query = `
      UPDATE ${table}
      SET ${setClauses.join(', ')}
      WHERE ${whereClauses.join(' AND ')}
    `;

    const params = [...setParams, ...whereParams];

    return { query, params };
  }

  buildSelect(
    table: string,
    where?: SqlWhereConditions,
    options?: SqlSelectOptions,
  ): ISqlBuilderResult {
    let query = `SELECT * FROM ${table}`;

    const params: any[] = [];
    const whereClauses: string[] = [];

    if (where) {
      this.whereConstructor(where, whereClauses, params);
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

  buildDelete(table: string, where: SqlWhereConditions): ISqlBuilderResult {
    const whereClauses: string[] = [];
    const params: any[] = [];
    this.whereConstructor(where, whereClauses, params);

    const query = `
      DELETE FROM ${table}
      WHERE ${whereClauses.join(' AND ')}
    `;

    return { query, params };
  }

  whereConstructor(
    whereObject: SqlWhereConditions,
    whereClausesArray: string[],
    params: any[],
  ) {
    for (const key in whereObject) {
      switch (key) {
        case 'equal':
          Object.entries(whereObject[key]).forEach(([column, value]) => {
            whereClausesArray.push(`${column} = ?`);
            params.push(value);
          });
          break;
        case 'like':
          Object.entries(whereObject[key]).forEach(
            ([percentType, data]: [PercentageTypes, any]) => {
              if (data) {
                Object.entries(data).forEach(([column, value]) => {
                  whereClausesArray.push(`${column} LIKE ?`);
                  const percentedValue =
                    percentType === 'right'
                      ? `${value}%`
                      : percentType === 'left'
                        ? `%${value}`
                        : `%${value}%`;
                  params.push(percentedValue);
                });
              }
            },
          );
          break;
        case 'lt':
          Object.entries(whereObject[key]).forEach(([column, value]) => {
            whereClausesArray.push(`${column} < ?`);
            params.push(value);
          });
          break;
        case 'lte':
          Object.entries(whereObject[key]).forEach(([column, value]) => {
            whereClausesArray.push(`${column} <= ?`);
            params.push(value);
          });
          break;
        case 'gt':
          Object.entries(whereObject[key]).forEach(([column, value]) => {
            whereClausesArray.push(`${column} > ?`);
            params.push(value);
          });
          break;
        case 'gte':
          Object.entries(whereObject[key]).forEach(([column, value]) => {
            whereClausesArray.push(`${column} >= ?`);
            params.push(value);
          });
          break;
        case 'in':
          Object.entries(whereObject[key]).forEach(([column, value]) => {
            if (!Array.isArray(value)) {
              throw new BadRequestException('SYNTAX_ERROR');
            }
            const questionMarksForIn = value.reduce(
              (acc) => `${acc ? `${acc}, ?` : `?`}`,
              '',
            );
            whereClausesArray.push(`${column} IN (${questionMarksForIn})`);
            params.push(...value);
          });
          break;
        case 'between':
          Object.entries(whereObject[key]).forEach(([column, value]) => {
            if (!Array.isArray(value) || value.length !== 2) {
              throw new BadRequestException(
                `Field "${column}" expects an array for "IN" condition`,
              );
            }
            whereClausesArray.push(`${column} BETWEEN ? AND ?`);
            params.push(...value);
          });
          break;
        case 'isNull':
          whereObject[key].forEach((column) => {
            whereClausesArray.push(`${column} IS NULL`);
          });
          break;
        case 'isNotNull':
          whereObject[key].forEach((column) => {
            whereClausesArray.push(`${column} IS NOT NULL`);
          });
          break;
      }
    }
  }
}
