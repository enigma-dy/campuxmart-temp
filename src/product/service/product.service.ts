import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../schema/product.schema';
import { UserService } from 'src/user/service/user.service';
import { NotificationService } from 'src/notification/notification.service';
import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  async create(dto: CreateProductDto, userId: string): Promise<Product> {
    const user = await this.userService.findById(userId);
    if (!user || !user.isVendor()) {
      throw new ForbiddenException('Only vendors can create products');
    }

    const productData = {
      ...dto,
      vendorId: new Types.ObjectId(userId),
      reviews: [],
      averageRating: 0,
      totalReviews: 0,
    };

    const product = await this.productModel.create(productData);

    // Notify admin of new product
    await this.notificationService.sendEmail(
      process.env.ADMIN_EMAIL || 'admin@example.com',
      'new-product',
      {
        subject: 'New Product Created',
        productName: product.name,
        vendorName: `${user.firstName} ${user.lastName}`,
      },
    );

    return product;
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().populate('vendorId').exec();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('vendorId')
      .populate('reviews')
      .exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    product.viewCount += 1;
    await product.save();
    return product;
  }

  async findByVendor(vendorId: string): Promise<Product[]> {
    return this.productModel
      .find({ vendorId: new Types.ObjectId(vendorId) })
      .exec();
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    userId: string,
  ): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    const user = await this.userService.findById(userId);
    if (!user || (product.vendorId.toString() !== userId && !user.isAdmin())) {
      throw new ForbiddenException(
        'You are not authorized to update this product',
      );
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('vendorId')
      .exec();

    if (!updatedProduct) {
      throw new InternalServerErrorException('Failed to update product');
    }
    return updatedProduct;
  }

  async delete(id: string, userId: string): Promise<void> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    const user = await this.userService.findById(userId);
    if (!user || (product.vendorId.toString() !== userId && !user.isAdmin())) {
      throw new ForbiddenException(
        'You are not authorized to delete this product',
      );
    }

    await this.productModel.deleteOne({ _id: id }).exec();
  }

  async updateRatings(productId: string): Promise<void> {
    const result = await this.productModel.db
      .collection('reviews')
      .aggregate([
        { $match: { productId: new Types.ObjectId(productId) } },
        {
          $group: {
            _id: '$productId',
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
          },
        },
      ])
      .toArray();

    if (result.length > 0) {
      await this.productModel.updateOne(
        { _id: productId },
        {
          averageRating: result[0].averageRating,
          totalReviews: result[0].totalReviews,
        },
      );
    } else {
      await this.productModel.updateOne(
        { _id: productId },
        { averageRating: 0, totalReviews: 0 },
      );
    }
  }
}
