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
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/role.decorator';
import { UserRole } from '../user/schema/user.schema';
import { AuthRequest } from '../user/dto/auth-request.dto';
import { Req } from '@nestjs/common';
import { Types } from 'mongoose';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Roles(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() reviewData: CreateReviewDto, @Req() req: AuthRequest) {
    return this.reviewService.create({
      ...reviewData,
      userId: new Types.ObjectId(req.user.id),
      productId: new Types.ObjectId(reviewData.productId), // ✅ Convert to ObjectId
      storeId: new Types.ObjectId(reviewData.storeId), // ✅ Convert to ObjectId
      email: req.user.email!,
    });
  }

  @Public()
  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Public()
  @Get('filter')
  async getByProductOrStore(
    @Query('productId') productId: string,
    @Query('storeId') storeId: string,
  ): Promise<Review[]> {
    return this.reviewService.findReviewByProductOrStore(productId, storeId);
  }
}
