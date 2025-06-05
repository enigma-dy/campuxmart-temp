import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './review.schema';
import { AuthRequest } from '../user/dto/auth-request.dto';
import { Req } from '@nestjs/common';
import { Types } from 'mongoose';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new review' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Failed to create review' })
  create(@Body() reviewData: CreateReviewDto, @Req() req: AuthRequest) {
    return this.reviewService.create({
      ...reviewData,
      userId: new Types.ObjectId(req.user.id),
      productId: new Types.ObjectId(reviewData.productId),
      storeId: new Types.ObjectId(reviewData.storeId),
      email: req.user.email!,
    });
  }

  @Get()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'List of all reviews' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.reviewService.findAll();
  }

  @Get('filter')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get reviews by product or store ID' })
  @ApiQuery({
    name: 'productId',
    required: false,
    description: 'Filter by product ID',
  })
  @ApiQuery({
    name: 'storeId',
    required: false,
    description: 'Filter by store ID',
  })
  @ApiResponse({ status: 200, description: 'List of filtered reviews' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getByProductOrStore(
    @Query('productId') productId: string,
    @Query('storeId') storeId: string,
  ): Promise<Review[]> {
    return this.reviewService.findReviewByProductOrStore(productId, storeId);
  }
}
