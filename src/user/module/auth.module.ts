import { Global, Module } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { AuthService } from '../service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../controller/auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../guard/auth.guard';
import { UserModule } from './user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }, AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
