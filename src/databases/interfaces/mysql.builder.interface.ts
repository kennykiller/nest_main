export interface ISqlBuilder {
  buildInsert(
    table: string,
    data: Record<string, any>,
  ): { query: string; params: any[] };
  buildUpdate(
    table: string,
    updateData: Record<string, any>,
    where: IWhereOptions,
  ): { query: string; params: any[] };
  buildSelect(
    table: string,
    where?: IWhereOptions,
    options?: SqlSelectOptions,
  ): { query: string; params: any[] };
  buildDelete(
    table: string,
    where: IWhereOptions,
  ): { query: string; params: any[] };
  whereConstructor(
    whereObject: IWhereOptions,
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

export interface IWhereOptions {
  equal?: Record<string, any>;
  gt?: Record<string, any>;
  gte?: Record<string, any>;
  lt?: Record<string, any>;
  lte?: Record<string, any>;
  like?: {
    [K in PercentageTypes]?: Record<string, any>;
  };
  in?: Record<string, any[]>;
  between?: Record<string, [string | number, string | number]>;
  isNull?: string[];
  isNotNull?: string[];
}
