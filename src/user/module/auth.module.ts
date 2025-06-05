// auth.module.ts
import { Global, Module } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { AuthService } from '../service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../controller/auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../guard/auth.guard';
import { UserModule } from './user.module';
import { ConfigService } from 'src/config/config.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.jwt.secret,
        signOptions: { expiresIn: configService.jwt.expiresIn },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }, AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
