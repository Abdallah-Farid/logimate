import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { AuthService } from '../auth/auth.service';
import { RolesGuard } from '../auth/roles.guard';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ message: string }> {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersService.createUser(email, hashedPassword);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ token: string }> {
    const user = await this.usersService.validateUser(email, password);

    const token = await this.authService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<any> {
    return req.user; // Return the user object attached by the guard
  }

  @UseGuards(JwtAuthGuard, new RolesGuard(['admin']))
  @Get('admin-only')
  getAdminData() {
    return { message: 'This route is restricted to admins.' };
  }
}
