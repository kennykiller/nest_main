// decorators/password.decorator.ts
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return /\d/.test(value) && /[A-Z]/.test(value);
        },
        defaultMessage: () =>
          'Password must contain at least one digit and one uppercase letter.',
      },
    });
  };
}
