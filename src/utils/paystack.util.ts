import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClient } from '../helpers/client/http.client';
import {
  PaystackResponse,
  VerifyPaymentResponse,
} from '../interfaces/paystack';

@Injectable()
export class PaystackUtil {
  constructor(private readonly configService: ConfigService) {}

  getAuthorizationHeader(
    headers?: Record<string, string>,
  ): Record<string, string> {
    const PAYSTACK_SECRET_KEY = this.configService.get<string>(
      'PAYSTACK_SECRET_KEY',
    );
    return {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  async verifyPaymentCode(code: string) {
    const PAYSTACK_BASE_URL =
      this.configService.get<string>('PAYSTACK_BASE_URL');
    const headers = this.getAuthorizationHeader();
    const response = await HttpClient.build(PAYSTACK_BASE_URL).get<
      PaystackResponse<VerifyPaymentResponse>
    >(`/paymentrequest/verify/${code}`, headers);
    return response;
  }
}
