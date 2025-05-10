import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository.service';
import { CreateUserDto } from './dto/create-user-dto';
import { hash } from 'bcrypt';
import { IUser } from './interfaces/user.interface';
import { UserResponseDto } from './dto/user-response-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { PatchUserDto } from './dto/patch-user-dto';
import { IMysqlUpdateResponse } from '../databases/mysql.interfaces';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepository) {}

  async getAllUsers(limit: number = 5): Promise<UserResponseDto[]> {
    const users = (await this.usersRepo.getUsers({ limit })) as IUser[];

    return users.map((u) => new UserResponseDto(u));
  }

  async getOneById(userId: number): Promise<UserResponseDto | null> {
    const [user] = (await this.usersRepo.getUserById(userId)) as [IUser];

    if (!user) {
      return null;
    }
    return new UserResponseDto(user);
  }

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await hash(dto.password, 10);
    const createdUserId = await this.usersRepo.createUser({
      ...dto,
      password: hashedPassword,
    });

    return this.getOneById(createdUserId);
  }

  async getUsersByEmail(
    email: string,
    limit: number = 5,
  ): Promise<UserResponseDto[]> {
    const users = (await this.usersRepo.getUsersByEmail(
      email,
      limit,
    )) as IUser[];

    return users.map((u) => new UserResponseDto(u));
  }

  async updateOne(
    userId: number,
    data: UpdateUserDto,
  ): Promise<IMysqlUpdateResponse> {
    return this.usersRepo.updateUser(userId, data);
  }

  async patchOne(
    userId: number,
    data: PatchUserDto,
  ): Promise<IMysqlUpdateResponse> {
    return this.usersRepo.patchUser(userId, data);
  }

  // async deleteOne(id: number) {}
}
