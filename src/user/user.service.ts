// src/user/user.service.ts (Corrected and Final Version)

// import {
//   Injectable,
//   ConflictException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '../database/entities/user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
// import { LoginUserDto } from './dto/login-user.dto';
// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//     private readonly jwtService: JwtService,
//   ) {}

//   async signup(createUserDto: CreateUserDto): Promise<{ token: string }> {
//     const { email, password, firstName, lastName } = createUserDto;

//     const existingUser = await this.userRepository.findOne({ where: { email } });
//     if (existingUser) {
//       throw new ConflictException('Email already registered');
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = this.userRepository.create({
//       first_name: firstName,
//       last_name: lastName,
//       email,
//       password_hash: hashedPassword, // Use the correct field 'password_hash'
//     });

//     await this.userRepository.save(user);

//     const payload = { sub: user.id, email: user.email, role: user.role };
//     const token = this.jwtService.sign(payload);

//     return { token };
//   }

//   async login(loginUserDto: LoginUserDto): Promise<{ token:string }> {
//     const { email, password } = loginUserDto;

//     const user = await this.userRepository.findOne({ where: { email } });
//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     // Compare with the correct field 'password_hash'
//     const isPasswordMatching = await bcrypt.compare(password, user.password_hash);
//     if (!isPasswordMatching) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const payload = { sub: user.id, email: user.email, role: user.role };
//     const token = this.jwtService.sign(payload);

//     return { token };
//   }

//   async findOne(id: string): Promise<User> {
//     return this.userRepository.findOne({ where: { id } });
//   }
// }




// src/user/user.service.ts (Updated)
// import {
//   Injectable,
//   ConflictException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '../database/entities/user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
// import { LoginUserDto } from './dto/login-user.dto';
// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//     private readonly jwtService: JwtService,
//   ) {}

//   // Signup method remains the same...
//   async signup(createUserDto: CreateUserDto): Promise<{ token: string }> {
//     const { email, password, firstName, lastName } = createUserDto;
//     const existingUser = await this.userRepository.findOne({ where: { email } });
//     if (existingUser) {
//       throw new ConflictException('Email already registered');
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = this.userRepository.create({
//       first_name: firstName,
//       last_name: lastName,
//       email,
//       password_hash: hashedPassword,
//     });
//     await this.userRepository.save(user);
//     const payload = { sub: user.id, email: user.email, role: user.role };
//     const token = this.jwtService.sign(payload);
//     return { token };
//   }

//   // 👇 LOGIN METHOD IS UPDATED HERE
//   async login(loginUserDto: LoginUserDto): Promise<{ token: string; user: User }> {
//     const { email, password } = loginUserDto;
//     const user = await this.userRepository.findOne({ where: { email } });
//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }
//     const isPasswordMatching = await bcrypt.compare(
//       password,
//       user.password_hash,
//     );
//     if (!isPasswordMatching) {
//       throw new UnauthorizedException('Invalid credentials');
//     }
//     const payload = { sub: user.id, email: user.email, role: user.role };
//     const token = this.jwtService.sign(payload);
    
//     // Return both the token and the user object
//     return { token, user };
//   }

//   // findOne method remains the same...
//   async findOne(id: string): Promise<User> {
//     return this.userRepository.findOne({ where: { id } });
//   }
// }



import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<{ token: string }> {
    const { email, password, firstName, lastName } = createUserDto;
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      first_name: firstName,
      last_name: lastName,
      email,
      password_hash: hashedPassword,
    });
    await this.userRepository.save(user);
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return { token };
  }

  // 👇 LOGIN METHOD IS UPDATED HERE
  async login(loginUserDto: LoginUserDto): Promise<{ token: string; user: User }> {
    const { email, password } = loginUserDto;

    // We now tell TypeORM to also load the 'restaurants' relation
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['restaurants'], // 👈 THIS IS THE FIX
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordMatching = await bcrypt.compare(
      password,
      user.password_hash,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token, user };
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}