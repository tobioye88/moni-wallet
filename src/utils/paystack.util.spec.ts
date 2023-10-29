import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@nestjs/config';
import { HttpClient } from '../helpers/client/http.client';
import { PaystackUtil } from './paystack.util';

describe('PaystackUtil', () => {
  let paystackUtil: PaystackUtil;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaystackUtil,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    paystackUtil = module.get<PaystackUtil>(PaystackUtil);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('getAuthorizationHeader', () => {
    it('should return the correct authorization header', () => {
      const PAYSTACK_SECRET_KEY = 'test_secret_key'; // Replace with your actual secret key
      const customHeaders = { 'Custom-Header': 'Custom-Value' };

      jest.spyOn(configService, 'get').mockReturnValue(PAYSTACK_SECRET_KEY);

      const headers = paystackUtil.getAuthorizationHeader(customHeaders);

      expect(headers).toBeDefined();
      expect(headers['Authorization']).toBe(`Bearer ${PAYSTACK_SECRET_KEY}`);
      expect(headers['Content-Type']).toBe('application/json');
      expect(headers['Custom-Header']).toBe('Custom-Value');
    });
  });

  describe('verifyPaymentCode', () => {
    it('should call HttpClient to verify payment code', async () => {
      const PAYSTACK_BASE_URL = 'https://api.paystack.com';
      const code = 'payment_code_here';

      const expectedResponse = {
        status: true,
        data: {
          // Your expected response data here
        },
      };

      jest.spyOn(configService, 'get').mockReturnValue(PAYSTACK_BASE_URL);

      const httpClientGetMock = jest
        .spyOn(HttpClient.prototype, 'get')
        .mockResolvedValue(expectedResponse);

      const result = await paystackUtil.verifyPaymentCode(code);

      expect(result).toEqual(expectedResponse);

      expect(httpClientGetMock).toHaveBeenCalledWith(
        `/paymentrequest/verify/${code}`,
        paystackUtil.getAuthorizationHeader(),
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
