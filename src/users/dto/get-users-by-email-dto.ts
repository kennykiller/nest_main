import { IsNotEmpty, IsString } from 'class-validator';
import { GetUsersDto } from './get-users-dto';

export class GetUsersByEmailDto extends GetUsersDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
