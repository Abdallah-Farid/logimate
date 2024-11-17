import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key',
    });
    this.logger.log('JWT Strategy initialized');
  }

  async validate(payload: any): Promise<UserPayload> {
    this.logger.debug('Validating JWT payload:', payload);

    if (!payload || !payload.id || !payload.email) {
      this.logger.error('Invalid JWT payload:', payload);
      throw new UnauthorizedException('Invalid token payload');
    }

    const user: UserPayload = {
      id: payload.id,
      email: payload.email,
      role: payload.role || 'user',
    };

    this.logger.debug('JWT payload validated:', user);
    return user;
  }
}
