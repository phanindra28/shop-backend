import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { UsersService } from './users.service';
import { User } from '../../generated/prisma/client';
import { LoginRequest } from './dto/login.request';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post('/register')
  async createUser(@Body() userData: CreateUserRequest) {
    return this.userService.createUser(userData);
  }
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.getUsers();
  }
  @Post('/login')
  async login(@Body() loginData: LoginRequest) {
    return this.userService.login(loginData);
  }
}
