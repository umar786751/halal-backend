import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Restaurant } from 'src/database/entities/restraunt.entity';
import { SignupOwnerDto } from '../restraunt/dto/signup-owner.dto';
import { UserRole } from 'src/database/entities/user.entity';
import { uploadImage } from 'src/utils/utils';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class UsersService {
  private s3Client: S3Client;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AKIA54WIFXBVWM7CFRWD',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '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',
      },
    });
  }

async signupOwner(signupDto: SignupOwnerDto, file: any) {
    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({ where: { email: signupDto.business_email } });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const imageUrl = await uploadImage(file, this.s3Client);

    // Create owner (User)
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(signupDto.password, salt);

    const [firstName, ...lastNameParts] = signupDto.full_name.split(' ');
    const newUser = this.usersRepository.create({
      first_name: firstName,
      last_name: lastNameParts.join(' '),
      email: signupDto.business_email,
      password_hash: hashedPassword,
      phone: signupDto.mobile_number,
      role: UserRole.OWNER,
    });
    const owner = await this.usersRepository.save(newUser);

    // Create restaurant
    const newRestaurant = this.restaurantRepository.create({
      name: signupDto.business_name,
      cuisine_type: signupDto.business_cuisine,
      business_type: signupDto.business_type,
      category: signupDto.business_category,
      branch_count: signupDto.branch_count,
      street_address: signupDto.business_address,
      building_name: signupDto.building_name,
      house_number: signupDto.house_number,
      city: signupDto.city,
      state: signupDto.state,
      area: signupDto.area,
      tax_registration_number: signupDto.tax_registration_number,
      owner: owner,
      is_active: false, // default: inactive until approved
      banner_image: imageUrl,
    });

    const restaurant = await this.restaurantRepository.save(newRestaurant);

    return {
      message: 'Business registered successfully!',
      owner: {
        id: owner.id,
        email: owner.email,
        name: `${owner.first_name} ${owner.last_name}`,
      },
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        type: restaurant.business_type,
        category: restaurant.category,
        cuisine: restaurant.cuisine_type,
      },
    };
  }



  async findAll(query: any): Promise<{ data: User[]; total: number }> {
    const { page = 1, limit = 10, search = '', role = '', active = '' } = query;

    const where: any = {};
    if (search) {
      where.email = Like(`%${search}%`);
    }
    if (role) {
      where.role = role;
    }
    if (active !== '') {
      where.is_active = ['true', true, 1, '1'].includes(active);
    }

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: Number(limit),
      order: { created_at: 'DESC' },
    });

    return { data: users, total };
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email },relations:['restaurants'] });
    if (!user) throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  async create(dto: CreateUserDto, reqUser: User): Promise<User> {
    if (reqUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create users');
    }

    const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already in use');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const newUser = this.usersRepository.create({
      first_name: dto.first_name,
      last_name: dto.last_name,
      email: dto.email,
      password_hash: hashedPassword,
      phone: dto.phone,
      role: dto.role as UserRole,
      is_active: true,  
    });

    return this.usersRepository.save(newUser);
  }

  async update(id: string, dto: UpdateUserDto, reqUser: User): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    // Allow self-update or admin
    if (reqUser.role !== UserRole.ADMIN && reqUser.id !== id) {
      throw new ForbiddenException('Not allowed to update this user');
    }

    Object.assign(user, dto);

    if (dto.password && dto.password !== '') {
      const salt = await bcrypt.genSalt();
      user.password_hash = await bcrypt.hash(dto.password, salt);
    }

    return this.usersRepository.save(user);
  }

  async delete(id: string, reqUser: User): Promise<void> {
    if (reqUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete users');
    }

    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.usersRepository.remove(user);
  }

  async updateStatus(id: string, reqUser: User): Promise<User> {
    if (reqUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update user status');
    }

    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    user.is_active = !user.is_active;
    return this.usersRepository.save(user);
  }
}
