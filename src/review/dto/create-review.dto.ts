import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'The ID of the product being reviewed' })
  @IsString({ message: 'Product ID must be a string' })
  productId: string;

  @ApiProperty({ description: 'The ID of the store where the product is sold' })
  @IsString({ message: 'Store ID must be a string' })
  storeId: string;

  @ApiProperty({ description: 'The rating given by the reviewer (1-5)' })
  @IsNumber({ allowNaN: false }, { message: 'Rating must be a number' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating cannot exceed 5' })
  rating: number;

  @ApiProperty({ description: 'The comment left by the reviewer' })
  @IsString({ message: 'Comment must be a string' })
  comment: string;

  @ApiProperty({ description: 'The title of the review (optional)' })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @ApiProperty({ description: 'The images attached to the review (optional)' })
  @IsOptional()
  @IsArray({ message: 'Images must be an array' })
  images?: string[];
}
