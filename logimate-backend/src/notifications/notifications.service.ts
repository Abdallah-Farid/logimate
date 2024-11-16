import { Injectable, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  async createForUser(userId: string, message: string) {
    try {
      this.logger.debug(`Creating notification for user: ${userId}`);
      const notification = this.notificationsRepository.create({
        userId,
        message,
      });
      const saved = await this.notificationsRepository.save(notification);
      this.logger.debug('Notification created:', saved);
      return saved;
    } catch (error) {
      this.logger.error('Error creating notification:', error);
      throw new InternalServerErrorException('Failed to create notification');
    }
  }

  async markAsRead(id: string) {
    try {
      this.logger.debug(`Marking notification as read: ${id}`);
      
      // First check if the notification exists
      const notification = await this.notificationsRepository.findOne({
        where: { id }
      });
      
      if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }

      // Update the notification
      await this.notificationsRepository.update(id, { read: true });
      
      // Return the updated notification
      return await this.notificationsRepository.findOne({
        where: { id }
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Error marking notification as read:', error);
      throw new InternalServerErrorException('Failed to mark notification as read');
    }
  }
}
