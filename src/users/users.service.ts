import { Injectable } from '@nestjs/common';
import { UsersSqlService } from './users.sql-service';

@Injectable()
export class UsersService {
  constructor(private sqlService: UsersSqlService) {}

  getAllUsers(limit: number = 1) {
    return this.sqlService.getUsers([limit]);
  }
}
