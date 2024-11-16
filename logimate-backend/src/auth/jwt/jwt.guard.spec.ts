import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1]; // Extract the Bearer token

    if (!token) {
      return false;
    }

    try {
      const decoded = await this.authService.validateToken(token);
      request.user = decoded; // Attach the decoded user to the request
      return true;
    } catch {
      return false;
    }
  }
}
