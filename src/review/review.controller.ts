import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './DTO/create-review.dto';
import { Review } from './review.schema';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() reviewData: CreateReviewDto) {
    return this.reviewService.create(reviewData);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get('filter')
  async getByProductOrStore(
    @Query('productId') productId: string,
    @Query('storeId') storeId: string,
  ): Promise<Review[]> {
    return this.reviewService.findReviewByProductOrStore(productId, storeId);
  }
}
