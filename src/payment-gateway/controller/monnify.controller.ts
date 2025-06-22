import { Controller, Post, Body, Headers, HttpCode } from '@nestjs/common';
import { MonnifyService } from '../service/monnify.service';
import { OrderService } from 'src/orders/service/order.service';
import { OrderStatus } from 'src/orders/schema/order.schema';

@Controller('monnify')
export class MonnifyController {
  constructor(
    private readonly monnifyService: MonnifyService,
    private readonly orderService: OrderService,
  ) {}

  @Post()
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

    if (paymentStatus === 'PAID' && orderId) {
      await this.orderService.updateStatus(orderId, {
        order_status: OrderStatus.PROCESSING,
      });
    }
  }
}
