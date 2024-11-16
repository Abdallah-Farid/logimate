import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: any): Promise<string> {
    this.logger.debug('Generating token with payload:', payload);
    return this.jwtService.sign(payload);
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      this.logger.debug('Token validated successfully:', decoded);
      return decoded;
    } catch (err) {
      this.logger.error('Token validation failed:', err);
      throw new Error('Invalid or expired token');
    }
  }
}
