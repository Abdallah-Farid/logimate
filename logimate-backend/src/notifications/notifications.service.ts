import { Injectable, Logger, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notifications.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  async findAllForUser(userId: string) {
    try {
      this.logger.debug(`Finding notifications for user: ${userId}`);
      const notifications = await this.notificationsRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
      this.logger.debug(`Found ${notifications.length} notifications`);
      return notifications;
    } catch (error) {
      this.logger.error('Error finding notifications:', error);
      throw new InternalServerErrorException('Failed to fetch notifications');
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      this.logger.debug(`Getting unread count for user: ${userId}`);
      const count = await this.notificationsRepository.count({
        where: { userId, read: false },
      });
      this.logger.debug(`Found ${count} unread notifications`);
      return count;
    } catch (error) {
      this.logger.error('Error getting unread count:', error);
      throw new InternalServerErrorException('Failed to get unread count');
    }
  }

  async createForUser(userId: string, message: string) {
    try {
      this.logger.debug(`Creating notification for user: ${userId}`);
      const notification = this.notificationsRepository.create({
        userId,
        message,
        read: false,
      });
      const saved = await this.notificationsRepository.save(notification);
      this.logger.debug('Notification created:', saved);
      return saved;
    } catch (error) {
      this.logger.error('Error creating notification:', error);
      throw new InternalServerErrorException('Failed to create notification');
    }
  }

  async markAsRead(id: string, userId: string) {
    try {
      this.logger.debug(`Marking notification ${id} as read for user ${userId}`);
      
      const notification = await this.notificationsRepository.findOne({
        where: { id },
      });

      if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }

      if (notification.userId !== userId) {
        throw new ForbiddenException('You can only mark your own notifications as read');
      }

      notification.read = true;
      const updated = await this.notificationsRepository.save(notification);
      this.logger.debug('Notification marked as read:', updated);
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      this.logger.error('Error marking notification as read:', error);
      throw new InternalServerErrorException('Failed to mark notification as read');
    }
  }
}
