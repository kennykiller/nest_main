import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateCatDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsPositive()
  age: number;
}
