import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  email: string;

  @Exclude()
  password_hash: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
