import { IsEmail, IsString } from 'class-validator';
import { UserPermission, UserRole } from '../schema/user.schema';

export class CreateUserDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class UpdateUserDto {
  @IsString()
  firstName?: string;
  @IsString()
  lastName?: string;
  @IsString()
  email?: string;
  @IsString()
  password?: string;
  @IsString()
  role?: UserRole;
  @IsString()
  permissions?: UserPermission[];
  @IsString()
  isActive?: boolean;
  @IsString()
  storename?: string;
  @IsString()
  storeDescription?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
