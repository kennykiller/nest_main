import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUser() {}

  @Post()
  createUser() {}

  @Put(':id')
  updateUser() {}

  @Patch(':id')
  patchUser() {}

  @Delete(':id')
  deleteUser() {}
}
