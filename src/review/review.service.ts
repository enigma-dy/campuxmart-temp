import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';

import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/service/user.service';
import { ProductService } from 'src/product/service/product.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private productService: ProductService,
    private notificationService: NotificationService,
    private userService: UserService,
  ) {}

  async create(reviewData: Partial<Review>): Promise<{ message: string }> {
    try {
      const user = await this.userService.findById(
        reviewData.userId!.toString(),
      );
      if (!user) {
        throw new InternalServerErrorException('User not found');
      }
      const createdReview = new this.reviewModel(reviewData);
      const review = await createdReview.save();
      const { productId } = review;

      // Update product ratings
      await this.productService.updateRatings(productId.toString());

      // Notify vendor of new review
      const product = await this.productService.findById(productId.toString());
      const vendor = await this.userService.findById(
        product.vendorId.toString(),
      );
      await this.notificationService.sendEmail(vendor!.email, 'new-review', {
        subject: 'New Review for Your Product',
        productName: product.name,
        rating: review.rating,
        comment: review.comment,
        reviewerName: `${user.firstName} ${user.lastName}`,
      });

      return { message: `Review for ${productId} has been created` };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create review: ' + error.message,
      );
    }
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel
      .find()
      .populate('userId')
      .populate('productId')
      .exec();
  }

  async findReviewByProductOrStore(
    productId?: string,
    storeId?: string,
  ): Promise<Review[]> {
    const filter: any = {};
    if (productId) filter.productId = new Types.ObjectId(productId);
    if (storeId) filter.storeId = new Types.ObjectId(storeId);
    return this.reviewModel.find(filter).populate('userId').exec();
  }
}
