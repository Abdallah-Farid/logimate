import { Injectable, NotFoundException, OnModuleInit, Logger, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    try {
      // Create demo user if it doesn't exist
      const demoEmail = 'demo@example.com';
      this.logger.log(`Checking for demo user: ${demoEmail}`);
      
      const existingUser = await this.findByEmail(demoEmail);
      
      if (!existingUser) {
        this.logger.log('Creating demo user...');
        const hashedPassword = await bcrypt.hash('demo123', 10);
        const demoUser = await this.createUser(demoEmail, hashedPassword, 'admin');
        this.logger.log(`Demo user created with ID: ${demoUser.id}`);
      } else {
        this.logger.log('Demo user already exists');
      }
    } catch (error) {
      this.logger.error('Failed to initialize demo user:', error);
      throw error;
    }
  }

  async createUser(email: string, password: string, role: string = 'user'): Promise<User> {
    this.logger.debug(`Creating user with email: ${email} and role: ${role}`);
    
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    try {
      const user = this.userRepository.create({ 
        email, 
        password,
        role 
      });
      const savedUser = await this.userRepository.save(user);
      this.logger.debug(`User created with ID: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error('Failed to create user:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    this.logger.debug(`Finding user by email: ${email}`);
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      this.logger.debug(user ? `User found with ID: ${user.id}` : 'User not found');
      return user;
    } catch (error) {
      this.logger.error('Failed to find user:', error);
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    this.logger.debug(`Validating user: ${email}`);

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    try {
      const user = await this.findByEmail(email);
      if (!user) {
        this.logger.debug(`User not found: ${email}`);
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        this.logger.debug(`Invalid password for user: ${email}`);
        throw new UnauthorizedException('Invalid email or password');
      }

      this.logger.debug(`User validated successfully: ${email}`);
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Failed to validate user:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
