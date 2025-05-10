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
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { GetUsersDto } from './dto/get-users-dto';
import { GetUsersByEmailDto } from './dto/get-users-by-email-dto';
import { UserResponseDto } from './dto/user-response-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { PatchUserDto } from './dto/patch-user-dto';
import { AtLeastOneFieldPipe } from '../pipes/at-least-one-field.pipe';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get()
  getAllUsers(@Query() query: GetUsersDto): Promise<UserResponseDto[]> {
    return this.userService.getAllUsers(query.limit);
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getOneById(id);
  }

  @Get('search-by/email')
  getUsersByEmail(
    @Query() query: GetUsersByEmailDto,
  ): Promise<UserResponseDto[]> {
    return this.userService.getUsersByEmail(query.email, query.limit);
  }

  @Post()
  createUser(@Body() body: CreateUserDto): Promise<UserResponseDto | null> {
    return this.userService.createUser(body);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateOne(id, body);
  }

  @Patch(':id')
  patchUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(new AtLeastOneFieldPipe()) body: PatchUserDto,
  ) {
    return this.userService.patchOne(id, body);
  }

  @Delete(':id')
  deleteUser() {}
}
