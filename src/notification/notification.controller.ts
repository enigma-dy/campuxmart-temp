import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  send(@Body() body: { email: string; template: string; data: any }) {
    return this.notificationService.sendEmail(
      body.email,
      body.template,
      body.data,
    );
  }
}
