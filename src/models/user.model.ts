import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserScheme {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  password: string;

  @IsNumber()
  created_at: number;

  @IsOptional()
  @IsNumber()
  updated_at?: number;
}
