import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(message: string | string[]) {
    super({
      error: 'Validation Error',
      message: message,
    });
  }
}
