import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewModule } from './review/review.module';
import { NotificationModule } from './notification/notification.module';
import { TemplateModule } from './templates/template.module';
import { UserService } from './user/service/user.service';
import { DatabaseModule } from './db/db.module';
import { UserModule } from './user/module/user.module';
import { AuthModule } from './user/module/auth.module';
import { ConfigService } from './config/config.service';
import { OrderModule } from './orders/module/order.module';
import { MonnifyService } from './payment-gateway/service/monnify.service';
import { HttpModule } from '@nestjs/axios';
import { MonnifyModule } from './payment-gateway/module/monnify.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ReviewModule,
    NotificationModule,
    TemplateModule,
    UserModule,
    AuthModule,
    OrderModule,
    MonnifyModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService, ConfigService],
})
export class AppModule {}
