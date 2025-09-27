import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser && (await bcrypt.compare(password, existingUser.password_hash))) {
      const { password_hash, ...result } = existingUser;
      return result; // pass forward without password
    }
    throw new BadRequestException('Invalid credentials');
  }
  

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    delete user.password_hash;
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user,
      expiresIn: '7d'
    };
  }
}
