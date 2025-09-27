// src/components/cart/cart.service.ts (Updated)

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../../database/entities/cart.entity';
import { CartItem } from '../../database/entities/cart-item.entity';
import { User } from '../../database/entities/user.entity';
import { MenuItem } from '../../database/entities/menu.items.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  private async getUserCart(user: User): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['items', 'items.menuItem'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ user, items: [] });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addItemToCart(user: User, addToCartDto: AddToCartDto): Promise<Cart> {
    const { menuItemId, quantity } = addToCartDto;
    const cart = await this.getUserCart(user);

    const menuItem = await this.menuItemRepository.findOne({ where: { id: menuItemId } });
    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    let cartItem = cart.items.find((item) => item.menuItem.id === menuItemId);

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        menuItem,
        quantity,
      });
      cart.items.push(cartItem);
    }

    await this.cartItemRepository.save(cartItem);
    return this.getUserCart(user);
  }

  async getCart(user: User): Promise<Cart> {
    return this.getUserCart(user);
  }

  // 👇 NEW METHOD
  async updateItemQuantity(user: User, itemId: string, quantity: number): Promise<Cart> {
    const cart = await this.getUserCart(user);
    const cartItem = cart.items.find((item) => item.id === itemId);

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    if (quantity > 0) {
      cartItem.quantity = quantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      await this.cartItemRepository.remove(cartItem);
    }

    return this.getUserCart(user);
  }

  // 👇 NEW METHOD
  async removeItemFromCart(user: User, itemId: string): Promise<Cart> {
    const cart = await this.getUserCart(user);
    const cartItem = cart.items.find((item) => item.id === itemId);

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    await this.cartItemRepository.remove(cartItem);
    return this.getUserCart(user);
  }
}