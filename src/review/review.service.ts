import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';

import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/service/user.service';
import { ProductService } from 'src/product/service/product.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private productService: ProductService,
    private notificationService: NotificationService,
    private userService: UserService,
  ) {}

  async create(
    userId: string,
    reviewData: CreateReviewDto,
  ): Promise<{ message: string }> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException(`Invalid userId: ${userId}`);
      }

      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userEmail = user.email;
      if (!Types.ObjectId.isValid(reviewData.productId)) {
        throw new BadRequestException(
          `Invalid productId: ${reviewData.productId}`,
        );
      }
      if (!Types.ObjectId.isValid(reviewData.storeId)) {
        throw new BadRequestException(`Invalid storeId: ${reviewData.storeId}`);
      }

      const review = new this.reviewModel({
        userId: user._id,
        email: userEmail,
        ...reviewData,
      });
      const createdReview = await review.save();
      const { productId } = createdReview;

      await this.productService.updateRatings(productId.toString());

      const product = await this.productService.findById(productId.toString());
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (!Types.ObjectId.isValid(product.vendorId)) {
        throw new BadRequestException(`Invalid vendorId: ${product.vendorId}`);
      }

      const vendor = await this.userService.findById(
        product.vendorId._id.toString(),
      );
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      // await this.notificationService.sendEmail(vendor.email, 'new-review', {
      //   subject: 'New Review for Your Product',
      //   productName: product.title,
      //   rating: createdReview.rating,
      //   comment: createdReview.comment,
      //   reviewerName: `${user.fullname}`,
      // });

      return { message: `Review for ${product.sku} has been created` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create review: ${error.message}`,
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
