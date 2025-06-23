import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  Max,
  IsEnum,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductVariantDto {
  @ApiPropertyOptional({ example: 'M' })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiPropertyOptional({ example: 'Red' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: 'SKU123456' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 49.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: ['https://example.com/image1.jpg'] })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ example: 'BARCODE123456' })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({ example: 0.5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;
}

export class ProductOfferDto {
  @ApiProperty({ example: 'Summer Sale' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'SUMMER20' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'percentage' })
  @IsString()
  discountType: string;

  @ApiProperty({ example: 20 })
  @IsNumber()
  discountValue: number;

  @ApiPropertyOptional({ example: '2025-07-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2025-07-15T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ example: ['minimum_purchase_100'] })
  @IsArray()
  @IsOptional()
  conditions?: string[];
}

export class ProductSpecificationDto {
  @ApiProperty({ example: 'Material' })
  @IsString()
  key: string;

  @ApiProperty({ example: 'Cotton' })
  @IsString()
  value: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Men T-Shirt' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'High quality cotton t-shirt for men.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ type: [ProductVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  @IsOptional()
  variations?: ProductVariantDto[];

  @ApiPropertyOptional({ example: ['https://example.com/image1.jpg'] })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ example: '665f1f29a945d9188572492c' })
  @IsString()
  @IsOptional()
  vendorId: string;

  @ApiPropertyOptional({ example: ['shirts', 'men'] })
  @IsArray()
  @IsOptional()
  categories?: string[];

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ type: [ProductOfferDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOfferDto)
  @IsOptional()
  offers?: ProductOfferDto[];

  @ApiPropertyOptional({ type: [ProductSpecificationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecificationDto)
  @IsOptional()
  specifications?: ProductSpecificationDto[];

  @ApiPropertyOptional({ example: ['summer', 'casual'] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: 'TSHIRT-MEN-001' })
  @IsString()
  sku: string;

  @ApiPropertyOptional({ example: 'TrendyBrand' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiPropertyOptional({ example: 0.3 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({
    example: { length: 10, width: 8, height: 2 },
  })
  @IsOptional()
  dimensions?: { length: number; width: number; height: number };

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: '2025-06-30T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  releaseDate?: Date;

  @ApiPropertyOptional({ example: 'men-tshirt-trendybrand' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 'Buy Men T-Shirt Online' })
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @ApiPropertyOptional({
    example: 'High-quality t-shirts for men available now.',
  })
  @IsString()
  @IsOptional()
  metaDescription?: string;

  @ApiPropertyOptional({
    enum: ['active', 'inactive', 'discontinued'],
    example: 'active',
  })
  @IsEnum(['active', 'inactive', 'discontinued'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: ['665f22e7b3f27d6d3a54c5e1'] })
  @IsArray()
  @IsOptional()
  relatedProducts?: string[];

  @ApiPropertyOptional({ example: 7.5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxRate?: number;
}

export class UpdateProductDto extends CreateProductDto {}
