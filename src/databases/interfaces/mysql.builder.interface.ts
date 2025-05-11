export interface ISqlBuilder {
  buildInsert(table: string, data: Record<string, any>): ISqlBuilderResult;
  buildUpdate(
    table: string,
    updateData: Record<string, any>,
    where: SqlWhereConditions,
  ): ISqlBuilderResult;
  buildSelect(
    table: string,
    where?: SqlWhereConditions,
    options?: SqlSelectOptions,
  ): ISqlBuilderResult;
  buildDelete(table: string, where: SqlWhereConditions): ISqlBuilderResult;
  whereConstructor(
    whereObject: SqlWhereConditions,
    whereClausesArray: any[],
    params: any[],
  ): void;
}

export type SqlSelectOptions = {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
};

export type PercentageTypes = 'right' | 'left' | 'both';
type SqlInCondition = Record<string, any[]>;
type SqlBetweenCondition = Record<string, [any, any]>;
export interface ISqlBuilderResult {
  query: string;
  params: any[];
}

export interface SqlWhereConditions {
  equal?: Record<string, any>;
  gt?: Record<string, any>;
  gte?: Record<string, any>;
  lt?: Record<string, any>;
  lte?: Record<string, any>;
  like?: {
    [K in PercentageTypes]?: Record<string, any>;
  };
  in?: SqlInCondition;
  between?: SqlBetweenCondition;
  isNull?: string[];
  isNotNull?: string[];
}
