import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
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
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new ForbiddenException('User not found');
      }

      const allowedRoles = ['admin', 'superAdmin', 'vendor'];
      if (!allowedRoles.includes(user.role)) {
        throw new ForbiddenException(
          'Only admins, super admins, and vendors can create products',
        );
      }

      const skuSet = new Set();
      for (const variant of dto.variations || []) {
        if (
          !variant.sku ||
          typeof variant.sku !== 'string' ||
          !variant.sku.trim()
        ) {
          throw new BadRequestException('Each variant must have a valid SKU.');
        }
        if (skuSet.has(variant.sku)) {
          throw new BadRequestException(
            `Duplicate SKU detected: ${variant.sku}`,
          );
        }
        skuSet.add(variant.sku);
      }

      if (dto.offers) {
        dto.offers = dto.offers.map((offer) => ({
          ...offer,
          startDate: offer.startDate ? new Date(offer.startDate) : undefined,
          endDate: offer.endDate ? new Date(offer.endDate) : undefined,
        }));
      }

      const productData = {
        ...dto,
        vendorId: new Types.ObjectId(userId),
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
      };

      const product = await this.productModel.create(productData);

      // Optional email notification
      // await this.notificationService.sendEmail(...);

      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new InternalServerErrorException(
        error?.message || 'Something went wrong while creating the product',
      );
    }
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

  async createOffer(productId: string, offer: any): Promise<any> {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    if (!product.offers) {
      throw new NotFoundException(`Product has no offers`);
    }

    product.offers.push(offer);
    await product.save();
    return product;
  }

  async updateOffer(
    productId: string,
    offerId: string,
    offer: any,
  ): Promise<any> {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    if (!product.offers) {
      throw new NotFoundException(`Product has no offers`);
    }
    const index = product.offers.findIndex(
      (o) => o._id?.toString() === offerId,
    );
    if (index === -1) {
      throw new NotFoundException(`Offer with ID ${offerId} not found`);
    }
    product.offers[index] = offer;
    await product.save();
    return product;
  }

  async deleteOffer(productId: string, offerId: string): Promise<void> {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    if (!product.offers || product.offers.length === 0) {
      throw new NotFoundException(`Product has no offers`);
    }
    const index = product.offers.findIndex(
      (o) => o._id?.toString() === offerId,
    );
    if (index === -1) {
      throw new NotFoundException(`Offer with ID ${offerId} not found`);
    }
    product.offers.splice(index, 1);
    await product.save();
  }

  async createVariation(productId: string, variation: any): Promise<any> {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    product.variations.push(variation);
    await product.save();
    return product;
  }

  async updateVariation(
    productId: string,
    variationId: string,
    variation: any,
  ): Promise<any> {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    const index = product.variations.findIndex(
      (v) => v._id?.toString() === variationId,
    );
    if (index === -1) {
      throw new NotFoundException(`Variation with ID ${variationId} not found`);
    }
    product.variations[index] = variation;
    await product.save();
    return product;
  }

  async deleteVariation(productId: string, variationId: string): Promise<void> {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    const index = product.variations.findIndex(
      (v) => v._id?.toString() === variationId,
    );
    if (index === -1) {
      throw new NotFoundException(`Variation with ID ${variationId} not found`);
    }
    product.variations.splice(index, 1);
    await product.save();
  }
}
