import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor() {
    const envFile = fs.existsSync('.env') ? '.env' : '.env.example';
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  get jwt() {
    return {
      secret: this.get('JWT_SECRET') || 'defaultSecretKey',
      expiresIn: this.get('JWT_EXPIRES_IN') || '3600s',
    };
  }

  get admin() {
    return {
      defaultEmail: process.env.ADMIN_EMAIL,
      defaultPassword: process.env.ADMIN_PASSWORD,
    };
  }
}
