import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

interface Variant {
  size?: string;
  color?: string;
  sku: string;
  stock: number;
  price: number;
  images?: string[];
  barcode?: string;
}

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, min: [0, 'Price cannot be negative'] })
  price: number;

  @Prop({
    type: [
      {
        size: String,
        color: String,
        sku: { type: String, unique: true },
        stock: { type: Number, min: 0 },
        price: { type: Number, min: 0 },
        images: [String],
        barcode: String,
      },
    ],
    default: [],
  })
  variants: Variant[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'Vendor' })
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

  @Prop({ type: Map, of: String, default: {} })
  specifications: Map<string, string>;

  @Prop({ type: [String], default: [], index: true })
  tags: string[];

  @Prop({ required: true, unique: true, trim: true })
  sku: string;

  @Prop({ type: String, trim: true, unique: true })
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
      return this.discountPercentage
        ? this.price * (1 - this.discountPercentage / 100)
        : this.price;
    },
  })
  discountedPrice: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  slug: 'text',
});

ProductSchema.index({ vendorId: 1 });

ProductSchema.pre('save', async function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  this.isAvailable =
    this.stock > 0 || this.variants.some((variant) => variant.stock > 0);
  next();
});

ProductSchema.virtual('fullName').get(function () {
  return this.brand ? `${this.brand} ${this.name}` : this.name;
});

ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });
