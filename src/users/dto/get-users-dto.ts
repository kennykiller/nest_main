import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class GetUsersDto {
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50;
}
