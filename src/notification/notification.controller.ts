import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

class SendNotificationDto {
  email: string;
  template: string;
  data: any;
}

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Send an email notification' })
  @ApiBody({ type: SendNotificationDto })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiResponse({ status: 500, description: 'Failed to send email' })
  send(@Body() body: { email: string; template: string; data: any }) {
    return this.notificationService.sendEmail(
      body.email,
      body.template,
      body.data,
    );
  }
}
