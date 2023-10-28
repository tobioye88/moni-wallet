import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { IResponseHelper } from './helpers/response.helper';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): IResponseHelper<null> {
    return this.appService.getHello();
  }
}
