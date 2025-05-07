import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(reviewData: Partial<Review>): Promise<{ message: string }> {
    try {
      const createdReview = new this.reviewModel(reviewData);
      const review = await createdReview.save();
      const { productId } = review;

      return { message: `Review for ${productId} has been created` };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create review');
    }
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel.find().exec();
  }

  async findReviewByProductOrStore(
    productId?: string,
    storeId?: string,
  ): Promise<Review[]> {
    const filter: any = {};
    if (productId) filter.productId = productId;
    if (storeId) filter.storeId = storeId;

    return this.reviewModel.find(filter).exec();
  }
}
