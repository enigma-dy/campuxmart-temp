import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullname: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Bio of John Doe', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'Business Name', required: false })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiProperty({ example: 'Business Category', required: false })
  @IsOptional()
  @IsString()
  businessCategory?: string;

  @ApiProperty({ example: 'Business Location', required: false })
  @IsOptional()
  @IsString()
  businessLocation?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsString()
  img?: string;

  @ApiProperty({ example: 'tore-name', required: false })
  @IsOptional()
  @IsString()
  storeName?: string;

  @ApiProperty({ example: 'Store description', required: false })
  @IsOptional()
  @IsString()
  storeDescription?: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  fullname?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'john.doe@example.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'password123', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'Bio of John Doe', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'Business Name', required: false })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiProperty({ example: 'Business Category', required: false })
  @IsOptional()
  @IsString()
  businessCategory?: string;

  @ApiProperty({ example: 'Business Location', required: false })
  @IsOptional()
  @IsString()
  businessLocation?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsString()
  img?: string;

  @ApiProperty({ example: 'tore-name', required: false })
  @IsOptional()
  @IsString()
  storeName?: string;

  @ApiProperty({ example: 'Store description', required: false })
  @IsOptional()
  @IsString()
  storeDescription?: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullname: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phoneNumber: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;
}
