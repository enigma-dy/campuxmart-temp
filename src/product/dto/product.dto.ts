import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  Max,
  IsEnum,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  @IsOptional()
  variants?: {
    size?: string;
    color?: string;
    sku: string;
    stock: number;
    price: number;
    images?: string[];
    barcode?: string;
    weight?: number;
  }[];

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  vendorId: string;

  @IsArray()
  @IsOptional()
  categories?: string[];

  @IsNumber()
  @Min(0)
  stock: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discountPercentage?: number;

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

  @IsEnum(['physical', 'digital', 'service'])
  @IsOptional()
  productType?: string;

  @IsArray()
  @IsOptional()
  relatedProducts?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  taxRate?: number;
}

export class UpdateProductDto extends CreateProductDto {}
