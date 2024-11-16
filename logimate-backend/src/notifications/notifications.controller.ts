import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);
  
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(@Request() req) {
    this.logger.debug('Request user object:', req.user);
    
    if (!req.user || !req.user.id) {
      this.logger.error('User ID missing from request:', req.user);
      throw new UnauthorizedException('User ID not found in token');
    }
    return this.notificationsService.findAllForUser(req.user.id);
  }

  @Post()
  createNotification(@Request() req, @Body('message') message: string) {
    this.logger.debug('Request user object:', req.user);
    
    if (!req.user || !req.user.id) {
      this.logger.error('User ID missing from request:', req.user);
      throw new UnauthorizedException('User ID not found in token');
    }
    return this.notificationsService.createForUser(req.user.id, message);
  }

  @Patch(':id')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
