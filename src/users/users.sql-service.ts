import { Injectable } from '@nestjs/common';
import { MySqlService } from '../databases/mysql.service';
import { CreateUserDto } from './dto/create-user-dto';
import { IMysqlInsertResponse } from '../databases/mysql.interfaces';
import { UsersQueriesService } from './users.queries.service';

@Injectable()
export class UsersSqlService {
  constructor(
    private mysqlService: MySqlService,
    private usersQueries: UsersQueriesService,
  ) {}

  async getUsers(params: any[]) {
    return this.mysqlService.query(
      this.usersQueries.queriesMap.getAllUsers,
      params,
    );
  }

  async createUser(userData: CreateUserDto): Promise<number> {
    const userPayload = [userData.email, userData.password, userData.name];

    const { insertId: userId }: IMysqlInsertResponse =
      (await this.mysqlService.query(
        this.usersQueries.queriesMap.createUser,
        userPayload,
      )) as IMysqlInsertResponse;

    return userId;
  }

  async getUserById(id: number) {
    return this.mysqlService.query(this.usersQueries.queriesMap.getUserById, [
      id,
    ]);
  }

  async getUsersByEmail(email: string, limit: number) {
    return this.mysqlService.query(
      this.usersQueries.queriesMap.getUsersByEmail,
      [email, limit],
    );
  }
}
