import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { UserPermission, UserRole } from '../schema/user.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email (must be valid)',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'User password (min 8 chars)',
    minLength: 8,
  })
  @IsString()
  password: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'John',
    description: 'Updated first name (optional)',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'Updated last name (optional)',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'new.email@example.com',
    description: 'Updated email (optional)',
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'NewSecurePassword456!',
    description: 'Updated password (optional)',
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.ADMIN,
    description: 'Updated user role (optional)',
  })
  @IsString()
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    type: [UserPermission],
    enum: UserPermission,
    enumName: 'UserPermission',
    example: [UserPermission.MANAGE_PRODUCTS, UserPermission.VIEW_ANALYTICS],
    description:
      'Updated user permissions (optional). Available permissions: manage_users, manage_vendors, manage_products, manage_orders, manage_settings, view_analytics, regular',
  })
  @IsOptional()
  permissions?: UserPermission[];

  @ApiPropertyOptional({
    example: true,
    description: 'Activation status (optional)',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'My Awesome Store',
    description: 'Updated store name (optional)',
  })
  @IsString()
  @IsOptional()
  storename?: string;

  @ApiPropertyOptional({
    example: 'A store selling tech gadgets',
    description: 'Updated store description (optional)',
  })
  @IsString()
  @IsOptional()
  storeDescription?: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Registered email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'yourPassword123',
    description: 'Account password',
  })
  @IsNotEmpty()
  password: string;
}
