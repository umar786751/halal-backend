import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './database/entities/user.entity';
import { Restaurant } from './database/entities/restraunt.entity';
import { MenuItem } from './database/entities/menu.items.entity';
import { Order } from './database/entities/order.entity';
import { OrderItem } from './database/entities/order.items.entity';
import { Review } from './database/entities/review.entity';
import { Deal } from './database/entities/deal.entity';
import { RestrauntModule } from './components/restraunt/restraunt.module';
import { UsersModule } from './components/users/users.module';
import { AuthModule } from './components/auth/auth.module';
import { MenuitemModule } from './components/menuitem/menuitem.module';
import { UserModule } from './user/user.module';
import { Cart } from './database/entities/cart.entity';
import { CartItem } from './database/entities/cart-item.entity';
import { CartModule } from './components/cart/cart.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'halalfood_dev',
      entities: [
        User,
        Restaurant,
        MenuItem,
        Order,
        OrderItem,
        Review,
        Deal,
        Cart, 
        CartItem, 
      ],
      synchronize: true, // Set to false in production
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false,
      } : false,
    }),
    TypeOrmModule.forFeature([
      User,Restaurant,MenuItem,Order,OrderItem,Review,Deal
    ]),
    RestrauntModule,UsersModule,AuthModule,MenuitemModule, UserModule, CartModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
