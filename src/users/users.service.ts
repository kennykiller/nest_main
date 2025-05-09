import { Injectable } from '@nestjs/common';
import { UsersSqlService } from './users.sql-service';
import { CreateUserDto } from './dto/create-user-dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private sqlService: UsersSqlService) {}

  getAllUsers(limit: number = 5) {
    return this.sqlService.getUsers([limit]);
  }

  getOneById(id: number) {
    return this.sqlService.getUserById(id);
  }

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await hash(dto.password, 10);
    return this.sqlService.createUser({ ...dto, password: hashedPassword });
  }
}
