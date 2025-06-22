// monnify.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import { AxiosResponse } from 'axios';
import { OrderService } from 'src/orders/service/order.service';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';

export interface MonnifyPaymentResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody: {
    transactionReference: string;
    paymentReference: string;
    amount: number;
    checkoutUrl: string;
  };
}

@Injectable()
export class MonnifyService {
  private contractCode = process.env.MONNIFY_CONTRACT_CODE;
  private apiKey = process.env.MONNIFY_API_KEY;
  private secretKey = process.env.MONNIFY_SECRET_KEY;
  private baseUrl = process.env.MONNIFY_BASE_URL;

  constructor(
    private readonly httpService: HttpService,
    private readonly orderService: OrderService,
  ) {}

  private getAuthHeader() {
    const token = Buffer.from(`${this.apiKey}:${this.secretKey}`).toString(
      'base64',
    );
    return `Basic ${token}`;
  }

  async initiatePayment(payload: CreateOrderDto) {
    try {
      const response: AxiosResponse<MonnifyPaymentResponse> =
        await firstValueFrom(
          this.httpService.post<MonnifyPaymentResponse>(
            `${this.baseUrl}/merchant/transactions/initiate`,
            {
              amount: payload.amount,
              customerName: payload.customer_email,
              customerEmail: payload.customer_email,
              paymentReference: payload.customer_email,
              paymentDescription: 'Payment for order',
              currencyCode: 'NGN',
              contractCode: this.contractCode,
              redirectUrl: '',
            },
            {
              headers: {
                Authorization: this.getAuthHeader(),
                'Content-Type': 'application/json',
              },
            },
          ),
        );
      const order = await this.orderService.create(payload);

      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(
        `Monnify payment initiation failed: ${error.message}`,
      );
    }
  }

  verifySignature(payload: any, signature: string) {
    const hash = crypto
      .createHmac('sha512', this.secretKey!)
      .update(JSON.stringify(payload))
      .digest('hex');
    return hash === signature;
  }
}
