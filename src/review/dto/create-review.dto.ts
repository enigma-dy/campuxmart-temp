import { IsEmail, IsInt, IsString, Min, Max, Length } from 'class-validator';

export class CreateReviewDto {
  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @Length(5, 1000)
  comment: string;

  @IsString()
  productId: string;

  @IsString()
  userId: string;

  @IsString()
  storeId: string;
}
