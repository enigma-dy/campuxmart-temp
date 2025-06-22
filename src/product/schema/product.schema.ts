import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

interface Variant {
  _id: Types.ObjectId;
  size?: string;
  color?: string;
  sku: string;
  stock: number;
  price: number;
  images?: string[];
  barcode?: string;
  weight?: number;
}

interface Offer {
  _id: Types.ObjectId;
  name: string;
  code: string;
  discountType: string;
  discountValue: number;
  startDate?: Date;
  endDate?: Date;
  conditions: string[];
}

interface Specification {
  key: string;
  value: string;
}

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, min: [0, 'Price cannot be negative'] })
  price: number;

  @Prop({
    type: [
      {
        _id: { type: Types.ObjectId, default: () => new Types.ObjectId() },
        size: String,
        color: String,
        sku: { type: String, required: true },
        stock: { type: Number, min: 0 },
        price: { type: Number, min: 0 },
        images: [String],
        barcode: String,
        weight: { type: Number, min: 0 },
      },
    ],
    default: [],
  })
  variations: Variant[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  vendorId: Types.ObjectId;

  @Prop({ type: [String], default: [], index: true })
  categories: string[];

  @Prop({ required: true, default: 0, min: [0, 'Stock cannot be negative'] })
  stock: number;

  @Prop({
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100'],
  })
  discountPercentage?: number;

  @Prop({
    type: [
      {
        _id: { type: Types.ObjectId, default: () => new Types.ObjectId() },
        name: String,
        code: String,
        discountType: String,
        discountValue: Number,
        startDate: Date,
        endDate: Date,
        conditions: [String],
      },
    ],
    default: [],
  })
  offers?: Offer[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Review' }], default: [] })
  reviews: Types.ObjectId[];

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  @Prop({
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active',
  })
  status: string;

  @Prop({ type: [{ key: String, value: String }], default: [] })
  specifications: Specification[];

  @Prop({ type: [String], default: [], index: true })
  tags: string[];

  @Prop({ required: true, unique: true, trim: true })
  sku: string;

  @Prop({ type: String, trim: true, unique: true, index: true })
  slug?: string;

  @Prop({ type: String, trim: true })
  brand?: string;

  @Prop({ type: Number, min: [0, 'Weight cannot be negative'] })
  weight?: number;

  @Prop({ type: { length: Number, width: Number, height: Number } })
  dimensions?: { length: number; width: number; height: number };

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: false })
  isAvailable: boolean;

  @Prop({ type: Date })
  releaseDate?: Date;

  @Prop({ type: String })
  metaTitle?: string;

  @Prop({ type: String })
  metaDescription?: string;

  @Prop({ type: Number, default: 0 })
  salesCount: number;

  @Prop({ type: Number, default: 0 })
  viewCount: number;

  @Prop({
    type: Number,
    get: function () {
      let finalPrice = this.price;
      if (this.discountPercentage) {
        finalPrice *= 1 - this.discountPercentage / 100;
      }
      if (this.offers && this.offers.length > 0) {
        const now = new Date();
        const activeOffer = this.offers.find(
          (offer) =>
            (!offer.startDate || offer.startDate <= now) &&
            (!offer.endDate || offer.endDate >= now) &&
            offer.discountType === 'percentage',
        );
        if (activeOffer) {
          finalPrice *= 1 - activeOffer.discountValue / 100;
        }
      }
      return finalPrice;
    },
  })
  discountedPrice: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  slug: 'text',
});
ProductSchema.index({ vendorId: 1 });

ProductSchema.pre('validate', function (next) {
  if (this.offers) {
    this.offers.forEach((offer) => {
      if (offer.startDate && typeof offer.startDate === 'string') {
        offer.startDate = new Date(offer.startDate);
        if (isNaN(offer.startDate.getTime())) {
          return next(new Error('Invalid startDate in offer'));
        }
      }
      if (offer.endDate && typeof offer.endDate === 'string') {
        offer.endDate = new Date(offer.endDate);
        if (isNaN(offer.endDate.getTime())) {
          return next(new Error('Invalid endDate in offer'));
        }
      }
    });
  }
  next();
});

ProductSchema.pre('save', async function (next) {
  const product = this as ProductDocument;

  if (!product.slug) {
    product.slug = product.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Check slug uniqueness
  const existingSlug = await this.model('Product').findOne({
    slug: product.slug,
    _id: { $ne: product._id },
  });
  if (existingSlug) {
    return next(new Error('Duplicate slug'));
  }

  const existingSku = await this.model('Product').findOne({
    sku: product.sku,
    _id: { $ne: product._id },
  });
  if (existingSku) {
    return next(new Error('Duplicate SKU'));
  }

  product.isAvailable =
    product.stock > 0 ||
    product.variations.some((variant) => variant.stock > 0);

  next();
});

ProductSchema.virtual('fullName').get(function () {
  return this.brand ? `${this.brand} ${this.title}` : this.title;
});

ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });
