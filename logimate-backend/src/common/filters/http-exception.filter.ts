import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse() as any;
      message = responseBody.message || exception.message;
      error = responseBody.error || 'Error';
    } else if (exception instanceof QueryFailedError) {
      // Handle database errors
      status = HttpStatus.BAD_REQUEST;
      if (exception.message.includes('invalid input syntax for type uuid')) {
        message = 'Invalid ID format';
        error = 'Validation Error';
      } else {
        message = 'Database operation failed';
        error = 'Database Error';
      }
    }

    // Log the error (you can implement proper logging here)
    console.error('Exception:', {
      status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });

    response.status(status).json({
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}
