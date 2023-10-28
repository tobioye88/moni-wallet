import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IResponseHelper } from './helpers/response.helper';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): IResponseHelper<null> {
    const APP_NAME = this.configService.get<String>('APP_NAME', '');
    return { message: `Welcome to ${APP_NAME}`, data: null };
  }
}
