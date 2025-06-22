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
import { OrderStatus } from '../schema/order.schema';

class ShippingAddressDto {
  @IsString()
  address: string;

  @IsString()
  zip: string;

  @IsString()
  country: string;
}

class OrderItemDto {
  @IsMongoId()
  product_id: string;

  @IsString()
  product_title: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsNumber()
  total_price: number;

  @IsOptional()
  @IsString()
  shipping_status?: string;

  @IsOptional()
  @IsString()
  shipping_tracking_number?: string;
}

export class CreateOrderDto {
  @IsEmail()
  customer_email: string;

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shipping_address: ShippingAddressDto;

  @IsOptional()
  @IsEnum(OrderStatus, {
    message: 'order_status must be one of: pending, completed',
  })
  order_status?: OrderStatus;

  @IsNumber()
  amount: number;

  @IsMongoId()
  seller: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  order_items: OrderItemDto[];

  @IsOptional()
  @IsString()
  order_notes?: string;

  @IsNumber()
  shipping_charges: number;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, {
    message:
      'order_status must be one of: pending, processing, shipped, delivered, completed, cancelled',
  })
  order_status: OrderStatus;
}
