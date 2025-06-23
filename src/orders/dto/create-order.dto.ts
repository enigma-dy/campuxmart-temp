import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../schema/order.schema';

class ShippingAddressDto {
  @ApiProperty({ example: '123 Main St' })
  @IsString()
  address: string;

  @ApiProperty({ example: '10001' })
  @IsString()
  zip: string;

  @ApiProperty({ example: 'USA' })
  @IsString()
  country: string;
}

class OrderItemDto {
  @ApiProperty({ example: '665f22e7b3f27d6d3a54c5e1' })
  @IsMongoId()
  product_id: string;

  @ApiProperty({ example: 'Wireless Mouse' })
  @IsString()
  product_title: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 25.5 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 51.0 })
  @IsNumber()
  total_price: number;

  @ApiProperty({ example: 'ADDIDAT-TY-0' })
  @IsNumber()
  product_sku: string;

  @ApiPropertyOptional({ example: 'pending' })
  @IsOptional()
  @IsString()
  shipping_status?: string;

  @ApiPropertyOptional({ example: 'TRK123456789' })
  @IsOptional()
  @IsString()
  shipping_tracking_number?: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'customer@example.com' })
  @IsEmail()
  customer_email: string;

  @ApiProperty({ type: ShippingAddressDto })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shipping_address: ShippingAddressDto;

  @ApiPropertyOptional({ enum: OrderStatus, example: OrderStatus.PENDING })
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: 'order_status must be one of: pending, completed',
  })
  order_status?: OrderStatus;

  @ApiProperty({ example: 60.5 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '665f1f29a945d9188572492c' })
  @IsMongoId()
  seller: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  order_items: OrderItemDto[];

  @ApiPropertyOptional({ example: 'Please deliver between 9 AM - 5 PM' })
  @IsOptional()
  @IsString()
  order_notes?: string;

  @ApiProperty({ example: 5.99 })
  @IsNumber()
  shipping_charges: number;
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.PROCESSING,
    description:
      'order_status must be one of: pending, processing, shipped, delivered, completed, cancelled',
  })
  @IsEnum(OrderStatus, {
    message:
      'order_status must be one of: pending, processing, shipped, delivered, completed, cancelled',
  })
  order_status: OrderStatus;
}
