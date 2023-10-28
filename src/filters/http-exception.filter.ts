import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { IResponseHelper } from '../helpers/response.helper';

@Catch(HttpException, Error)
export class HttpExceptionFilter implements ExceptionFilter<Error> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getResponse<Request>();
    const status = exception?.getStatus ? exception?.getStatus() : 500;

    response.status(status).json({
      message: exception.message,
      data: null,
    } as IResponseHelper<null>);
  }
}
