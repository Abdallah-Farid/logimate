import { Controller, Get, Post, Body, UseGuards, Request, Logger, BadRequestException, UnauthorizedException, Inject, forwardRef, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { AuthService } from '../auth/auth.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ message: string }> {
    this.logger.debug(`Registering new user with email: ${email}`);
    
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersService.createUser(email, hashedPassword);
    return { message: 'User registered successfully' };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() credentials: { email: string; password: string }) {
    this.logger.debug(`Login attempt for user: ${credentials.email}`);
    try {
      const result = await this.authService.login(credentials.email, credentials.password);
      this.logger.debug('Login successful');
      return result;
    } catch (error) {
      this.logger.error('Login failed:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    this.logger.debug(`Getting profile for user: ${req.user.email}`);
    const user = await this.usersService.findByEmail(req.user.email);
    return user ? user.toJSON() : null;
  }
}
