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

export class ProductVariantDto {
  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  sku: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;
}

export class ProductOfferDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  discountType: string;

  @IsNumber()
  discountValue: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsArray()
  @IsOptional()
  conditions?: string[];
}

export class ProductSpecificationDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  @IsOptional()
  variations?: ProductVariantDto[];

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  vendorId: string;

  @IsArray()
  @IsOptional()
  categories?: string[];

  @IsNumber()
  @Min(0)
  stock: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOfferDto)
  @IsOptional()
  offers?: ProductOfferDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecificationDto)
  @IsOptional()
  specifications?: ProductSpecificationDto[];

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  sku: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @IsOptional()
  dimensions?: { length: number; width: number; height: number };

  @IsOptional()
  isFeatured?: boolean;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  releaseDate?: Date;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsEnum(['active', 'inactive', 'discontinued'])
  @IsOptional()
  status?: string;

  @IsArray()
  @IsOptional()
  relatedProducts?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  taxRate?: number;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  @IsOptional()
  variations?: ProductVariantDto[];

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  vendorId?: string;

  @IsArray()
  @IsOptional()
  categories?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOfferDto)
  @IsOptional()
  offers?: ProductOfferDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSpecificationDto)
  @IsOptional()
  specifications?: ProductSpecificationDto[];

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @IsOptional()
  dimensions?: { length: number; width: number; height: number };

  @IsOptional()
  isFeatured?: boolean;

  @IsDate()
  @IsOptional()
  releaseDate?: Date;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsEnum(['active', 'inactive', 'discontinued'])
  @IsOptional()
  status?: string;

  @IsArray()
  @IsOptional()
  relatedProducts?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  taxRate?: number;
}
