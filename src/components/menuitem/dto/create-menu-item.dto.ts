import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsUUID,
  IsBoolean,
} from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({
    description: 'The ID of the restaurant this item belongs to',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID() // Ensures this is a valid UUID
  @IsNotEmpty()
  restaurant_id: string;

  @ApiProperty({ description: 'The name of the menu item', example: 'Classic Burger' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'A detailed description of the menu item',
    example: 'A juicy beef patty with fresh lettuce, tomato, and our secret sauce.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
  
  @ApiProperty({
    description: 'Allergy warnings or other cautions',
    example: 'Contains nuts and dairy.',
    required: false,
  })
  @IsString()
  @IsOptional()
  caution?: string;

  @ApiProperty({ description: 'The price of the item', example: 12.99 })
  @IsNumber()
  @Min(0) // Ensures the price cannot be negative
  price: number;

  @ApiProperty({
    description: 'The type of item (e.g., food, drink)',
    example: 'food',
    required: false,
  })
  @IsString()
  @IsOptional()
  item_type?: string;

  @ApiProperty({
    description: 'The tax rate for the item',
    example: 5.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  tax?: number;

  @ApiProperty({
    description: 'The category of the item (e.g., Appetizer, Main Course)',
    example: 'Burgers',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;
  
  @ApiProperty({ description: 'URL of the item image', example: 'http://example.com/image.png', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'Is the item currently available for ordering?',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_available?: boolean;
}

