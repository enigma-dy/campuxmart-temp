import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class NotificationService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendEmail(email: string, template: string, data: any) {
    try {
      const templatePath = join(
        process.cwd(),
        'src',
        'templates',
        'data',
        `${template}.ejs`,
      );

      if (!existsSync(templatePath)) {
        throw new NotFoundException(`Template ${template}.ejs not found`);
      }

      const html: string = await ejs.renderFile(templatePath, data);

      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: data.subject || 'Notification',
        html,
      });

      return { message: 'Email sent' };
    } catch (error) {
      console.error('Email error:', error);
      throw new InternalServerErrorException(
        'Failed to send email: ' + error.message,
      );
    }
  }
}
