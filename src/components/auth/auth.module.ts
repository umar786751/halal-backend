// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { UsersModule } from '../users/users.module';
// import { JwtStrategy } from './jwt.strategy';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../../database/entities/user.entity';
// @Module({
//   imports: [
//     UsersModule,
//     PassportModule,
//     JwtModule.register({
//       secret: process.env.JWT_SECRET || 'your_secret_key', // Keep this secret safe
//       signOptions: { expiresIn: '1h' },
//     }),
//     TypeOrmModule.forFeature([User]),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, JwtStrategy],
//   exports: [AuthService],
// })
// export class AuthModule {}




// src/components/auth/auth.module.ts (Corrected)

// src/components/auth/auth.module.ts (Correct Version)

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { ConfigService, ConfigModule } from '@nestjs/config'; // Make sure this is imported
// import { User } from 'src/database/entities/user.entity';
// import { Restaurant } from 'src/database/entities/restraunt.entity';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { JwtStrategy } from './jwt.strategy';
// import { UserJwtStrategy } from './user-jwt.strategy';
// import { UsersModule } from '../users/users.module';

// @Module({
//   imports: [
//     UsersModule,
//     ConfigModule, // <-- THIS LINE IS THE FIX. It must be here.
//     PassportModule.register({ defaultStrategy: 'jwt' }),
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => {
//         return {
//           secret: configService.get<string>('JWT_SECRET'),
//           signOptions: {
//             expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
//           },
//         };
//       },
//       inject: [ConfigService],
//     }),
//     TypeOrmModule.forFeature([User, Restaurant]),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, JwtStrategy, UserJwtStrategy],
//   exports: [PassportModule, JwtStrategy, UserJwtStrategy],
// })
// export class AuthModule {}



// new 
import { Module, forwardRef } from '@nestjs/common'; // 👈 IMPORT forwardRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { User } from 'src/database/entities/user.entity';
import { Restaurant } from 'src/database/entities/restraunt.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserJwtStrategy } from './user-jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule), // 👈 WRAP UsersModule here
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Restaurant]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserJwtStrategy],
  exports: [PassportModule, JwtStrategy, UserJwtStrategy],
})
export class AuthModule {}