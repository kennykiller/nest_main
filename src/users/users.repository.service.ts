import { Injectable } from '@nestjs/common';
import { MySqlService } from '../databases/mysql.service';
import { CreateUserDto } from './dto/create-user-dto';
import {
  IMysqlDeleteResponse,
  IMysqlInsertResponse,
  IMysqlUpdateResponse,
} from '../databases/mysql.interfaces';
import { MYSQL_TABLES } from '../utils/constants';
import { MySqlBuilderService } from '../databases/mysql.builder.service';
import { SqlSelectOptions } from '../databases/interfaces/mysql.builder.interface';
import { UpdateUserDto } from './dto/update-user-dto';
import { PatchUserDto } from './dto/patch-user-dto';

@Injectable()
export class UsersRepository {
  private table: string;
  constructor(
    private mysqlService: MySqlService,
    private queryBuilder: MySqlBuilderService,
  ) {
    this.table = MYSQL_TABLES.USERS;
  }

  async getUsers(options: SqlSelectOptions) {
    const { query, params } = this.queryBuilder.buildSelect(
      this.table,
      null,
      options,
    );

    const users = await this.mysqlService.query(query, params);

    return users;
  }

  async createUser(userData: CreateUserDto): Promise<number> {
    const { query, params: userPayload } = this.queryBuilder.buildInsert(
      this.table,
      userData,
    );

    const { insertId: userId }: IMysqlInsertResponse =
      (await this.mysqlService.query(
        query,
        userPayload,
      )) as IMysqlInsertResponse;

    return userId;
  }

  async getUserById(id: number) {
    const { query, params } = this.queryBuilder.buildSelect(
      this.table,
      {
        equal: {
          and: { id },
        },
      },
      { limit: 1 },
    );

    return this.mysqlService.query(query, params);
  }

  async getUsersByEmail(email: string, limit: number) {
    const { query, params } = this.queryBuilder.buildSelect(
      this.table,
      {
        like: { right: { and: { email } } },
      },
      { limit },
    );

    return this.mysqlService.query(query, params);
  }

  async updateUser(
    userId: number,
    data: UpdateUserDto,
  ): Promise<IMysqlUpdateResponse> {
    const { query, params } = this.queryBuilder.buildUpdate(this.table, data, {
      equal: { and: { id: userId } },
    });

    return this.mysqlService.query(
      query,
      params,
    ) as Promise<IMysqlUpdateResponse>;
  }

  async patchUser(
    userId: number,
    data: PatchUserDto,
  ): Promise<IMysqlUpdateResponse> {
    const { query, params } = this.queryBuilder.buildUpdate(this.table, data, {
      equal: { and: { id: userId } },
    });

    return this.mysqlService.query(
      query,
      params,
    ) as Promise<IMysqlUpdateResponse>;
  }

  async deleteUser(userId: number): Promise<IMysqlDeleteResponse> {
    const { query, params } = this.queryBuilder.buildDelete(this.table, {
      equal: { and: { id: userId } },
    });

    return this.mysqlService.query(
      query,
      params,
    ) as Promise<IMysqlDeleteResponse>;
  }
}
