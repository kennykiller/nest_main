import { IUser } from '../interfaces/user.interface';

export class UserResponseDto {
  id: number;
  name: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  email: string;

  constructor(data: IUser) {
    this.id = data.id;
    this.name = data.name;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.email = data.email;
  }
}
