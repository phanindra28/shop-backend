import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { UsersService } from './users.service';
import { User } from '../../generated/prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post()
  async createUser(@Body() userData: CreateUserRequest): Promise<User> {
    return this.userService.createUser(userData);
  }
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.getUsers();
  }
}
