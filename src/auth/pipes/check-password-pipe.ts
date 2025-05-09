import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PasswordStrengthPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'string' || !value.trim() || value.length < 6) {
      throw new BadRequestException(
        'Password must contain at least one digit and one uppercase letter.',
      );
    }

    if (!(/\d/.test(value) && /[A-Z]/.test(value))) {
      throw new BadRequestException('PASSWORD_IS_NOT_STRONG_ENOUGH');
    }

    return value;
  }
}
