import { Injectable } from '@nestjs/common';
import { UsersSqlService } from './users.sql-service';
import { CreateUserDto } from './dto/create-user-dto';
import { hash } from 'bcrypt';
import { IUser } from './interfaces/user.interface';
import { UserResponseDto } from './dto/user-response-dto';

@Injectable()
export class UsersService {
  constructor(private sqlService: UsersSqlService) {}

  async getAllUsers(limit: number = 5): Promise<UserResponseDto[]> {
    const users = (await this.sqlService.getUsers([limit])) as IUser[];

    return users.map((u) => new UserResponseDto(u));
  }

  async getOneById(id: number): Promise<UserResponseDto | null> {
    const [user] = (await this.sqlService.getUserById(id)) as [IUser];

    if (!user) {
      return null;
    }
    return new UserResponseDto(user);
  }

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await hash(dto.password, 10);
    const createdUserId = await this.sqlService.createUser({
      ...dto,
      password: hashedPassword,
    });

    return this.getOneById(createdUserId);
  }

  async getUsersByEmail(
    email: string,
    limit: number = 5,
  ): Promise<UserResponseDto[]> {
    const emailWithWildCard = `${email}%`;
    const users = (await this.sqlService.getUsersByEmail(
      emailWithWildCard,
      limit,
    )) as IUser[];

    return users.map((u) => new UserResponseDto(u));
  }

  async updateOne(id: number, ) {

  }

  async patchOne() {

  }

  async deleteOne(id: number) {
    
  }
}
