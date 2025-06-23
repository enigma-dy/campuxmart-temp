import { Controller, Post, Body, Headers, HttpCode } from '@nestjs/common';
import { MonnifyService } from '../service/monnify.service';
import { OrderService } from 'src/orders/service/order.service';
import { OrderStatus } from 'src/orders/schema/order.schema';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';

@Controller('monnify')
export class MonnifyController {
  constructor(
    private readonly monnifyService: MonnifyService,
    private readonly orderService: OrderService,
  ) {}

  @Post('initiate')
  @HttpCode(201)
  async initiatePayment(@Body() payload: CreateOrderDto) {
    const order = await this.orderService.create(payload);
    return this.monnifyService.initiatePayment(order);
  }

  @Post('webhook')
  @HttpCode(200)
  async handleMonnifyWebhook(
    @Body() payload: any,
    @Headers('monnify-signature') signature: string,
  ) {
    const isValid = this.monnifyService.verifySignature(payload, signature);
    if (!isValid) return;

    const paymentRef = payload.paymentReference;
    const paymentStatus = payload.paymentStatus;

    const orderId = paymentRef?.split('-')[1];
    if (!orderId) return;

    if (paymentStatus === 'PAID') {
      await this.orderService.updateStatus(orderId, {
        order_status: OrderStatus.PROCESSING,
      });
    }

    if (paymentStatus === 'FAILED') {
      await this.orderService.updateStatus(orderId, {
        order_status: OrderStatus.CANCELLED,
      });
    }
  }
}
