import { Controller, Post, Body, Get, UseGuards, Put, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../../database/entities/user.entity';
import { AddToCartDto } from './dto/add-to-cart.dto'; // This import should already be correct

@Controller('cart')
@UseGuards(AuthGuard('jwt-user')) // Protect all routes in this controller
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@GetUser() user: User) {
    return this.cartService.getCart(user);
  }

  @Post('items')
  addItemToCart(
    @GetUser() user: User,
    @Body() addToCartDto: AddToCartDto, // <-- THIS IS THE CORRECTED LINE
  ) {
    return this.cartService.addItemToCart(user, addToCartDto);
  }

  @Put('items/:itemId')
  updateItemQuantity(
    @GetUser() user: User,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateItemQuantity(user, itemId, quantity);
  }

  @Delete('items/:itemId')
  removeItemFromCart(
    @GetUser() user: User,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    return this.cartService.removeItemFromCart(user, itemId);
  }
}