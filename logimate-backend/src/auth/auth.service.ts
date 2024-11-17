import { Injectable, Logger, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async generateToken(payload: Partial<UserPayload>): Promise<string> {
    const tokenPayload: UserPayload = {
      id: payload.id || '1',
      email: payload.email || 'demo@example.com',
      role: payload.role || 'admin',
    };
    
    this.logger.debug('Generating token with payload:', tokenPayload);
    return this.jwtService.sign(tokenPayload);
  }

  async validateToken(token: string): Promise<UserPayload> {
    try {
      const decoded = this.jwtService.verify(token) as UserPayload;
      this.logger.debug('Token validated successfully:', decoded);
      return decoded;
    } catch (err) {
      this.logger.error('Token validation failed:', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersService.validateUser(email, password);
    const token = await this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { 
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    };
  }
}
