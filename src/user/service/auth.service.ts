import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from '../dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(data: LoginDto): Promise<any> {
    console.log(data);
    const user = await this.userService.findByEmail(data.email);
    if (!user || !(await user.comparePassword(data.password))) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user.toObject();

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permission: user.permissions,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: result,
    };
  }
}
