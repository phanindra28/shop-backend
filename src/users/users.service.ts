import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginRequest } from './dto/login.request';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }
  //
  // async users(params: {
  //   skip?: number;
  //   take?: number;
  //   cursor?: Prisma.UserWhereUniqueInput;
  //   where?: Prisma.UserWhereInput;
  //   orderBy?: Prisma.UserOrderByWithRelationInput;
  // }): Promise<User[]> {
  //   const { skip, take, cursor, where, orderBy } = params;
  //   return this.prisma.user.findMany({
  //     skip,
  //     take,
  //     cursor,
  //     where,
  //     orderBy,
  //   });
  // }

  async createUser(data: Prisma.UserCreateInput) {
    const { email, password } = data;
    const existingUser = await this.user({ email });
    const saltRounds = 10;
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hash: string = await bcrypt.hash(password, salt);
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hash,
      },
    });
    const { password: _, ...rest } = user;
    return rest;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
  async getUsers() {
    return this.prisma.user.findMany();
  }
  async login(loginRequest: LoginRequest) {
    const { email, password } = loginRequest;
    const user = await this.user({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.userId, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUser } = user;
    return { accessToken, user: safeUser };
  }
}
