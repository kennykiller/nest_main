import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ISqlBuilder,
  SqlWhereConditions,
  PercentageTypes,
  SqlSelectOptions,
  ISqlBuilderResult,
  SqlConditionType,
} from './interfaces/mysql.builder.interface';

interface IWhereClause {
  clause: string;
  conditionType: SqlConditionType;
}

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
    const whereClauses: Array<IWhereClause> = [];
    const whereParams: any[] = [];

    this.whereConstructor(where, whereClauses, whereParams);

    const query = `
      UPDATE ${table}
      SET ${setClauses.join(', ')}
      WHERE ${this.whereStringJoiner(whereClauses)}
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
    const whereClauses: Array<IWhereClause> = [];

    if (where) {
      this.whereConstructor(where, whereClauses, params);
      query += ` WHERE ${this.whereStringJoiner(whereClauses)}`;
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
    const whereClauses: Array<IWhereClause> = [];
    const params: any[] = [];
    this.whereConstructor(where, whereClauses, params);

    const query = `
      DELETE FROM ${table}
      WHERE ${this.whereStringJoiner(whereClauses)};
    `;

    return { query, params };
  }

  whereConstructor(
    whereObject: SqlWhereConditions,
    whereClausesArray: Array<IWhereClause>,
    params: any[],
  ) {
    for (const key in whereObject) {
      switch (key) {
        case 'equal':
          Object.entries(whereObject[key]).forEach(
            ([conditionType, subObject]: [
              SqlConditionType,
              Record<string, any>,
            ]) =>
              Object.entries(subObject).forEach(([column, value]) => {
                whereClausesArray.push({
                  clause: `${column} = ?`,
                  conditionType,
                });
                params.push(value);
              }),
          );
          break;
        case 'like':
          Object.entries(whereObject[key]).forEach(
            ([percentType, data]: [PercentageTypes, any]) => {
              if (data) {
                Object.entries(data).forEach(
                  ([conditionType, subObject]: [
                    SqlConditionType,
                    Record<string, any>,
                  ]) =>
                    Object.entries(subObject).forEach(([column, value]) => {
                      whereClausesArray.push({
                        clause: `${column} LIKE ?`,
                        conditionType,
                      });
                      const percentedValue =
                        percentType === 'right'
                          ? `${value}%`
                          : percentType === 'left'
                            ? `%${value}`
                            : `%${value}%`;
                      params.push(percentedValue);
                    }),
                );
              }
            },
          );
          break;
        case 'lt':
          Object.entries(whereObject[key]).forEach(
            ([conditionType, subObject]: [
              SqlConditionType,
              Record<string, any>,
            ]) =>
              Object.entries(subObject).forEach(([column, value]) => {
                whereClausesArray.push({
                  clause: `${column} < ?`,
                  conditionType,
                });
                params.push(value);
              }),
          );
          break;
        case 'lte':
          Object.entries(whereObject[key]).forEach(
            ([conditionType, subObject]: [
              SqlConditionType,
              Record<string, any>,
            ]) =>
              Object.entries(subObject).forEach(([column, value]) => {
                whereClausesArray.push({
                  clause: `${column} <= ?`,
                  conditionType,
                });
                params.push(value);
              }),
          );
          break;
        case 'gt':
          Object.entries(whereObject[key]).forEach(
            ([conditionType, subObject]: [
              SqlConditionType,
              Record<string, any>,
            ]) =>
              Object.entries(subObject).forEach(([column, value]) => {
                whereClausesArray.push({
                  clause: `${column} > ?`,
                  conditionType,
                });
                params.push(value);
              }),
          );
          break;
        case 'gte':
          Object.entries(whereObject[key]).forEach(
            ([conditionType, subObject]: [
              SqlConditionType,
              Record<string, any>,
            ]) =>
              Object.entries(subObject).forEach(([column, value]) => {
                whereClausesArray.push({
                  clause: `${column} >= ?`,
                  conditionType,
                });
                params.push(value);
              }),
          );
          break;
        case 'in':
          Object.entries(whereObject[key]).forEach(
            ([conditionType, subObject]: [
              SqlConditionType,
              Record<string, any[]>,
            ]) =>
              Object.entries(subObject).forEach(([column, value]) => {
                if (!Array.isArray(value)) {
                  throw new BadRequestException(
                    `Field "${column}" expects an array for "IN" condition`,
                  );
                }
                const questionMarksForIn = value.reduce(
                  (acc) => `${acc ? `${acc}, ?` : `?`}`,
                  '',
                );
                whereClausesArray.push({
                  clause: `${column} IN (${questionMarksForIn})`,
                  conditionType,
                });
                params.push(...value);
              }),
          );
          break;
        case 'between':
          Object.entries(whereObject[key]).forEach(
            ([conditionType, subObject]: [
              SqlConditionType,
              Record<string, [any, any]>,
            ]) =>
              Object.entries(subObject).forEach(([column, value]) => {
                if (!Array.isArray(value) || value.length !== 2) {
                  throw new BadRequestException(
                    `Field "${column}" expects an array for "BETWEEN" condition`,
                  );
                }
                whereClausesArray.push({
                  clause: `${column} BETWEEN ? AND ?`,
                  conditionType,
                });
                params.push(...value);
              }),
          );
          break;
        case 'isNull':
          Object.entries(whereObject[key]).forEach(
            ([conditionType, subArray]: [SqlConditionType, string[]]) =>
              subArray.forEach((column) => {
                whereClausesArray.push({
                  clause: `${column} IS NULL`,
                  conditionType,
                });
              }),
          );
          break;
        case 'isNotNull':
          Object.entries(whereObject[key]).forEach(
            ([conditionType, subArray]: [SqlConditionType, string[]]) =>
              subArray.forEach((column) => {
                whereClausesArray.push({
                  clause: `${column} IS NOT NULL`,
                  conditionType,
                });
              }),
          );
          break;
      }
    }
  }

  whereStringJoiner(whereClauseArray: IWhereClause[]): string {
    return whereClauseArray.reduce((acc, cur, idx) => {
      if (!idx) {
        acc = cur.clause;
      } else if (cur.conditionType === 'and') {
        acc = `${acc} AND ${cur.clause}`;
      } else {
        acc = `${acc} OR ${cur.clause}`;
      }

      return acc;
    }, '');
  }
}
