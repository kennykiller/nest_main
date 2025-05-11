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
export interface ISqlBuilderResult {
  query: string;
  params: any[];
}

export type SqlConditionType = 'and' | 'or';

export type SqlConditionBase = {
  [K in SqlConditionType]?: Record<string, any>;
};

type SqlInCondition = {
  [K in SqlConditionType]?: Record<string, any[]>;
};
type SqlBetweenCondition = {
  [K in SqlConditionType]?: Record<string, [any, any]>;
};
type SqlNullCondition = {
  [K in SqlConditionType]?: string[];
};

export interface SqlWhereConditions {
  equal?: SqlConditionBase;
  gt?: SqlConditionBase;
  gte?: SqlConditionBase;
  lt?: SqlConditionBase;
  lte?: SqlConditionBase;
  like?: {
    [K in PercentageTypes]?: SqlConditionBase;
  };
  in?: SqlInCondition;
  between?: SqlBetweenCondition;
  isNull?: SqlNullCondition;
  isNotNull?: SqlNullCondition;
  subCondition?: SqlWhereConditions;
}
