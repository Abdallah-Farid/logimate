import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Param, 
  Body, 
  UseGuards, 
  Request, 
  UnauthorizedException, 
  Logger,
  BadRequestException
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { NotificationsService } from './notifications.service';
import { UserPayload } from '../auth/auth.service';

interface RequestWithUser extends Request {
  user: UserPayload;
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);
  
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Request() req: RequestWithUser) {
    this.logger.debug('Getting notifications for user:', req.user);
    
    if (!req.user?.id) {
      throw new UnauthorizedException('User ID not found in token');
    }

    return this.notificationsService.findAllForUser(req.user.id);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: RequestWithUser) {
    this.logger.debug('Getting unread count for user:', req.user);
    
    if (!req.user?.id) {
      throw new UnauthorizedException('User ID not found in token');
    }

    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Post()
  async createNotification(
    @Request() req: RequestWithUser,
    @Body('message') message: string
  ) {
    this.logger.debug('Creating notification for user:', req.user);
    
    if (!req.user?.id) {
      throw new UnauthorizedException('User ID not found in token');
    }

    if (!message) {
      throw new BadRequestException('Message is required');
    }

    return this.notificationsService.createForUser(req.user.id, message);
  }

  @Patch(':id/read')
  async markAsRead(
    @Request() req: RequestWithUser,
    @Param('id') id: string
  ) {
    this.logger.debug(`Marking notification ${id} as read for user:`, req.user);
    
    if (!req.user?.id) {
      throw new UnauthorizedException('User ID not found in token');
    }

    if (!id) {
      throw new BadRequestException('Notification ID is required');
    }

    return this.notificationsService.markAsRead(id, req.user.id);
  }
}
