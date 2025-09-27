// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
// import { User } from '../../database/entities/user.entity';
// import { Restaurant } from '../../database/entities/restraunt.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([User,Restaurant])],
//   controllers: [UsersController],
//   providers: [UsersService],
//   exports: [UsersService], // Exported for AuthModule usage
// })
// export class UsersModule {}


//new 
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { Restaurant } from '../../database/entities/restraunt.entity'; // 👈 IMPORT RESTAURANT
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Restaurant]), // 👈 ADD RESTAURANT HERE
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}