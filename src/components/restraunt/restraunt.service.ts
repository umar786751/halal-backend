import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository, Like } from 'typeorm';
  import { Restaurant } from '../../database/entities/restraunt.entity';
  import { User, UserRole } from '../../database/entities/user.entity';
  import { CreateRestaurantDto } from './dto/create-restraunt.dto';
  import { UpdateRestaurantDto } from './dto/update-restraunt.dto';

  @Injectable()
  export class RestrauntService {
    constructor(
      @InjectRepository(Restaurant)
      private restaurantRepository: Repository<Restaurant>,
    ) {}
  
    async findAll(query: any): Promise<{ data: Restaurant[]; total: number }> {
      const { page = 1, limit = 20, search = '', city = '', cuisine = '' } = query;
  
      const where: any = {};
      if (search) {
        where.name = Like(`%${search}%`);
      }
      if (city) {
        where.city = Like(`%${city}%`);
      }
      if (cuisine) {
        where.cuisine_type = Like(`%${cuisine}%`);
      }
  
      const [restaurants, total] = await this.restaurantRepository.findAndCount({
        where,
        skip: (page - 1) * limit,
        take: limit,
        relations: ['owner', 'menu_items', 'reviews', 'deals'],
        order: {
          created_at: 'DESC',
        },
      });
  
      return { data: restaurants, total };
    }
  
    async findById(id: string): Promise<Restaurant> {
      const restaurant = await this.restaurantRepository.findOne({
        where: { id },
        relations: ['owner', 'menu_items', 'reviews', 'deals'],
      });
  
      if (!restaurant) {
        throw new NotFoundException(`Restaurant with ID ${id} not found`);
      }
  
      return restaurant;
    }
  
    async create(createRestaurantDto: CreateRestaurantDto, user: User): Promise<Restaurant> {
      if (user.role !== UserRole.OWNER && user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Only owners or admins can create restaurants');
      }
  
      const newRestaurant = this.restaurantRepository.create({
        ...createRestaurantDto,
        owner: user,
      });
  
      return this.restaurantRepository.save(newRestaurant);
    }
  
    async update(
      id: string,
      updateRestaurantDto: UpdateRestaurantDto,
      reqUser: User,
    ): Promise<Restaurant> {
      const restaurant = await this.restaurantRepository.findOne({
        where: { id },
        relations: ['owner'],
      });
  
      if (!restaurant) {
        throw new NotFoundException(`Restaurant with ID ${id} not found`);
      }
  
      if (reqUser.role !== UserRole.ADMIN && restaurant.owner.id !== reqUser.id) {
        throw new ForbiddenException('You are not authorized to update this restaurant');
      }
  
      Object.assign(restaurant, updateRestaurantDto);
  
      return this.restaurantRepository.save(restaurant);
    }
  
    async delete(id: string, reqUser: User): Promise<void> {
      const restaurant = await this.restaurantRepository.findOne({
        where: { id },
        relations: ['owner'],
      });
  
      if (!restaurant) {
        throw new NotFoundException(`Restaurant with ID ${id} not found`);
      }
  
      if (reqUser.role !== UserRole.ADMIN && restaurant.owner.id !== reqUser.id) {
        throw new ForbiddenException('You are not authorized to delete this restaurant');
      }
  
      await this.restaurantRepository.remove(restaurant);
    }
  
    async updateStatus(id: string, reqUser: User): Promise<Restaurant> {
      const restaurant = await this.restaurantRepository.findOne({
        where: { id },
        relations: ['owner'],
      });
  
      if (!restaurant) {
        throw new NotFoundException(`Restaurant with ID ${id} not found`);
      }
  
      if (reqUser.role !== UserRole.ADMIN && restaurant.owner.id !== reqUser.id) {
        throw new ForbiddenException('You are not authorized to update this restaurant status');
      }
  
      restaurant.is_active = !restaurant.is_active;
      return this.restaurantRepository.save(restaurant);
    }
  }
  