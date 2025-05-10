export interface ISqlBuilder {
  buildInsert(
    table: string,
    data: Record<string, any>,
  ): { query: string; params: any[] };
  buildUpdate(
    table: string,
    updateData: Record<string, any>,
    where: Record<string, any>,
  ): { query: string; params: any[] };
  buildSelect(
    table: string,
    where?: Record<string, any>,
    options?: SqlSelectOptions,
  ): { query: string; params: any[] };
  buildDelete(
    table: string,
    where: Record<string, any>,
  ): { query: string; params: any[] };
}

export type SqlSelectOptions = {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
};
