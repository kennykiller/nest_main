import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class AtLeastOneFieldPipe implements PipeTransform {
  transform(value: any) {
    const hasField = Object.keys(value).some(
      (key) =>
        value[key] !== undefined && value[key] !== null && value[key] !== '',
    );

    if (!hasField) {
      throw new BadRequestException(
        'You must provide at least one field to update',
      );
    }

    return value;
  }
}
