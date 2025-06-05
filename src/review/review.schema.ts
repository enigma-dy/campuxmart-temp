import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Store' })
  storeId: Types.ObjectId;

  @Prop({
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  })
  rating: number;

  @Prop({ required: true, trim: true })
  comment: string;

  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ default: false })
  verifiedPurchase: boolean;

  @Prop({
    type: [{ userId: { type: Types.ObjectId, ref: 'User' } }],
    default: [],
  })
  helpfulVotes: { userId: Types.ObjectId }[];

  @Prop({ default: 0 })
  helpfulCount: number;

  @Prop({ type: String })
  title?: string;

  @Prop({ type: [String], default: [] })
  images?: string[];

  @Prop({ default: false })
  isEdited: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index({ productId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1 });
ReviewSchema.index({ storeId: 1 });

ReviewSchema.pre('save', function (next) {
  this.helpfulCount = this.helpfulVotes.length;
  next();
});
