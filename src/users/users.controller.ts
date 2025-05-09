import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getOneById(id);
  }

  @Post()
  createUser(@Body() body: CreateUserDto): Promise<number> {
    return this.userService.createUser(body);
  }

  @Put(':id')
  updateUser() {}

  @Patch(':id')
  patchUser() {}

  @Delete(':id')
  deleteUser() {}
}
