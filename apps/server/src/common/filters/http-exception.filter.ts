import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../dto/api-response.dto.js';

const ERROR_CODE_MAP: Record<number, number> = {
  400: 40001,
  401: 40101,
  403: 40301,
  404: 40401,
  500: 50000,
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal Server Error';
    let code = 50000;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;

      message = Array.isArray(res?.message)
        ? res.message.join(', ')
        : res?.message || exception.message;

      code = ERROR_CODE_MAP[status] ?? 50000;
    } else {
      // 非 HttpException 一定要记录
      this.logger.error(exception);
    }

    response.status(status).json(ApiResponse.error(code, message));
  }
}
