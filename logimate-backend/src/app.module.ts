import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { Inventory } from './inventory/inventory.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/notifications.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [User, Inventory, Notification],
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    InventoryModule,
    NotificationsModule,
  ],
})
export class AppModule {}
