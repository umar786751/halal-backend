// src/components/cart/dto/add-to-cart.dto.ts

import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  @IsNotEmpty()
  menuItemId: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}