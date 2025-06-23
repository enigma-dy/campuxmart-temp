// monnify.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import { AxiosResponse } from 'axios';
import { OrderService } from 'src/orders/service/order.service';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { Order, OrderDocument } from 'src/orders/schema/order.schema';

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
  cachedToken: any;
  tokenExpiry: any;

  constructor(
    private readonly httpService: HttpService,
    private readonly orderService: OrderService,
  ) {}

  private async getAccessToken(): Promise<string> {
    const now = Date.now();

    if (this.cachedToken && this.tokenExpiry && now < this.tokenExpiry) {
      return this.cachedToken;
    }

    const token = Buffer.from(`${this.apiKey}:${this.secretKey}`).toString(
      'base64',
    );

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/api/v1/auth/login`,
          {},
          {
            headers: {
              Authorization: `Basic ${token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const { accessToken, expiresIn } = response.data.responseBody;

      this.cachedToken = accessToken;
      this.tokenExpiry = now + expiresIn * 1000 - 5000;

      return accessToken;
    } catch (error) {
      console.error(
        'Failed to fetch Monnify access token:',
        error?.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        'Could not authenticate with Monnify',
      );
    }
  }

  async initiatePayment(order: OrderDocument) {
    try {
      const accessToken = await this.getAccessToken();

      const response: AxiosResponse<MonnifyPaymentResponse> =
        await firstValueFrom(
          this.httpService.post<MonnifyPaymentResponse>(
            `${this.baseUrl}/api/v1/merchant/transactions/init-transaction`,
            {
              amount: order.amount,
              customerName: order.customer_email,
              customerEmail: order.customer_email,
              paymentReference: `order-${order._id}`,
              paymentDescription: 'Payment for order',
              currencyCode: 'NGN',
              contractCode: this.contractCode,
              redirectUrl: '', // optional
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            },
          ),
        );

      const { transactionReference, paymentReference } =
        response.data.responseBody;

      await this.orderService.update(order.id.toString(), {
        transaction_reference: transactionReference,
        payment_reference: paymentReference,
      });

      return response.data;
    } catch (error) {
      console.error(
        'Monnify Error:',
        error?.response?.data || error?.message || error,
      );

      throw new InternalServerErrorException(
        `Monnify payment initiation failed: ${
          error?.response?.data?.responseMessage ||
          error?.message ||
          'Unknown error'
        }`,
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
