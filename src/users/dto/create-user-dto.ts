import { IsOptional, IsString, Length } from 'class-validator';
import { IsStrongPassword } from '../decorators/password.decorator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  @Length(6)
  @IsStrongPassword({
    message:
      'Password must contain at least one digit and one uppercase letter.',
  })
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}
