import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  image: string;

  @IsOptional()
  store_id: string;

  @IsOptional()
  role: string;

  @IsOptional()
  store_name: string;

  @IsOptional()
  street_address: string;

  @IsOptional()
  street_address2: string;

  @IsOptional()
  suburb: string;

  @IsOptional()
  country: string;

  @IsOptional()
  city: string;

  @IsOptional()
  zip_code: string;

  @IsOptional()
  state: string;

  @IsOptional()
  timezone: string;
}
