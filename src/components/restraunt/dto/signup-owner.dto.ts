import { IsString, IsEmail, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SignupOwnerDto {
  // Owner info
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  business_email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  mobile_number?: string;

  // Restaurant info
  @IsString()
  @IsNotEmpty()
  business_name: string;

  @IsString()
  @IsNotEmpty()
  business_type: string; // e.g. Restaurant, Cafe, Grocery

  @IsString()
  @IsNotEmpty()
  business_category: string; // e.g. Fast Food, Fine Dining

  @IsString()
  @IsNotEmpty()
  business_cuisine: string; // e.g. Pakistani, Italian

  @Type(() => Number) // 👈 ensures string -> number conversion
  @IsNumber()
  branch_count: number;


  @IsString()
  @IsNotEmpty()
  business_address: string;

  @IsOptional()
  @IsString()
  building_name?: string;

  @IsOptional()
  @IsString()
  house_number?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  tax_registration_number?: string;
}
