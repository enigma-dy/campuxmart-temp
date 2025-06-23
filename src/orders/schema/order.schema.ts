import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface OrderItem {
  product_id: Types.ObjectId;
  product_title: string;
  product_sku: string;
  quantity: number;
  price: number;
  total_price: number;
  shipping_status: string;
  shipping_tracking_number: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, lowercase: true })
  customer_email: string;

  @Prop({
    type: {
      address: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
    },
    required: true,
  })
  shipping_address: {
    address: string;
    zip: string;
    country: string;
  };

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  order_status: OrderStatus;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  seller: Types.ObjectId;

  @Prop({
    type: [
      {
        product_id: { type: Types.ObjectId, ref: 'Product' },
        product_title: { type: String },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        total_price: { type: Number, required: true },
        shipping_status: { type: String },
        shipping_tracking_number: { type: String },
      },
    ],
    required: true,
  })
  order_items: OrderItem[];

  @Prop()
  transaction_reference?: string;

  @Prop()
  payment_reference?: string;

  @Prop({ type: String })
  order_notes?: string;

  @Prop({ required: true, min: 0 })
  shipping_charges: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ customer_email: 1 });
OrderSchema.index({ seller: 1 });
OrderSchema.index({ order_status: 1 });
