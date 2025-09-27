// src/components/cart/cart.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from '../../database/entities/cart.entity';
import { CartItem } from '../../database/entities/cart-item.entity';
import { MenuItem } from '../../database/entities/menu.items.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, MenuItem]),
    AuthModule, // Import AuthModule to use the UserJwtStrategy
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}