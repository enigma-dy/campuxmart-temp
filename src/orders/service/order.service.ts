import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from '../schema/order.schema';
import { CreateOrderDto, UpdateOrderStatusDto } from '../dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    const order = new this.orderModel({
      ...createOrderDto,
      order_status: createOrderDto.order_status || OrderStatus.PENDING,
    });
    return await order.save();
  }

  async update(id: string, data: Partial<Order>): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findBySeller(sellerId: string): Promise<Order[]> {
    return this.orderModel
      .find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');

    const currentStatus = order.order_status;
    const nextStatus = dto.order_status;

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    const allowed = validTransitions[currentStatus] || [];

    if (!allowed.includes(nextStatus)) {
      throw new Error(
        `Invalid status transition from '${currentStatus}' to '${nextStatus}'`,
      );
    }

    order.order_status = nextStatus;
    return order.save();
  }
}
