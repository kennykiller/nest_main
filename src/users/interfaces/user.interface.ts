export interface IUser {
  id: number;
  email: string;
  name: string | null;
  password: string;
  created_at: Date;
  updated_at: Date | null;
}
