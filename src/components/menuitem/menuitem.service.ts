import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Like, Repository } from 'typeorm';
  import { MenuItem } from '../../database/entities/menu.items.entity';
  import { Restaurant } from '../../database/entities/restraunt.entity';
  import { User, UserRole } from '../../database/entities/user.entity';
  import { CreateMenuItemDto } from './dto/create-menu-item.dto';
  import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
  import * as fs from 'fs';
  import * as Papa from 'papaparse';
  
  @Injectable()
  export class MenuitemService {
    constructor(
      @InjectRepository(MenuItem)
      private readonly menuRepo: Repository<MenuItem>,
      @InjectRepository(Restaurant)
      private readonly restRepo: Repository<Restaurant>,
    ) {}
  
    async findAll(query: any): Promise<{ data: MenuItem[]; total: number }> {
      const {
        page = 1,
        limit = 10,
        search = '',
        category = '',
        restaurant_id = '',
        available = '',
      } = query;
  
      const where: any = {};
      if (search) where.name = Like(`%${search}%`);
      if (category) where.category = Like(`%${category}%`);
      if (available !== '') where.is_available = ['true', true, 1, '1'].includes(available);
      if (restaurant_id) where.restaurant = { id: restaurant_id };
  
      const [items, total] = await this.menuRepo.findAndCount({
        where,
        skip: (page - 1) * limit,
        take: Number(limit),
        relations: ['restaurant'],
        order: { created_at: 'DESC' },
      });
  
      return { data: items, total };
    }
  
    async findById(id: string): Promise<MenuItem> {
      const item = await this.menuRepo.findOne({
        where: { id },
        relations: ['restaurant', 'restaurant.owner'],
      });
      if (!item) throw new NotFoundException(`Menu item ${id} not found`);
      return item;
    }
  
    async create(dto: CreateMenuItemDto, user: User): Promise<MenuItem> {
      if (user.role !== UserRole.OWNER && user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Only owners or admins can create menu items');
      }
  
      const restaurant = await this.restRepo.findOne({
        where: { id: dto.restaurant_id },
        relations: ['owner'],
      });
      if (!restaurant) throw new NotFoundException('Restaurant not found');
  
      if (user.role !== UserRole.ADMIN && restaurant.owner.id !== user.id) {
        throw new ForbiddenException('You are not authorized to add items to this restaurant');
      }
  
      const newItem = this.menuRepo.create({
        name: dto.name,
        description: dto.description,
        caution: dto.caution,
        price: dto.price,
        item_type: dto.item_type,
        tax: dto.tax,
        image: dto.image,
        category: dto.category,
        is_available: dto.is_available ?? true,
        restaurant,
      });
  
      return this.menuRepo.save(newItem);
    }
  
    async update(id: string, dto: UpdateMenuItemDto, user: User): Promise<MenuItem> {
      const item = await this.menuRepo.findOne({
        where: { id },
        relations: ['restaurant', 'restaurant.owner'],
      });
      if (!item) throw new NotFoundException('Menu item not found');
  
      if (user.role !== UserRole.ADMIN && item.restaurant.owner.id !== user.id) {
        throw new ForbiddenException('You are not authorized to update this item');
      }
  
      // If moving item to another restaurant, verify ownership too
      if (dto.restaurant_id && dto.restaurant_id !== item.restaurant.id) {
        const newRest = await this.restRepo.findOne({
          where: { id: dto.restaurant_id },
          relations: ['owner'],
        });
        if (!newRest) throw new NotFoundException('Target restaurant not found');
        if (user.role !== UserRole.ADMIN && newRest.owner.id !== user.id) {
          throw new ForbiddenException('You are not authorized to move item to this restaurant');
        }
        item.restaurant = newRest;
      }
  
      Object.assign(item, {
        name: dto.name ?? item.name,
        description: dto.description ?? item.description,
        caution: dto.caution ?? item.caution,
        price: dto.price ?? item.price,
        item_type: dto.item_type ?? item.item_type,
        tax: dto.tax ?? item.tax,
        image: dto.image ?? item.image,
        category: dto.category ?? item.category,
      });
  
      if (typeof dto.is_available === 'boolean') {
        item.is_available = dto.is_available;
      }
  
      return this.menuRepo.save(item);
    }
  
    async delete(id: string, user: User): Promise<void> {
      const item = await this.menuRepo.findOne({
        where: { id },
        relations: ['restaurant', 'restaurant.owner'],
      });
      if (!item) throw new NotFoundException('Menu item not found');
  
      if (user.role !== UserRole.ADMIN && item.restaurant.owner.id !== user.id) {
        throw new ForbiddenException('You are not authorized to delete this item');
      }
  
      await this.menuRepo.remove(item);
    }
  
    async updateStatus(id: string, user: User): Promise<MenuItem> {
      const item = await this.menuRepo.findOne({
        where: { id },
        relations: ['restaurant', 'restaurant.owner'],
      });
      if (!item) throw new NotFoundException('Menu item not found');
  
      if (user.role !== UserRole.ADMIN && item.restaurant.owner.id !== user.id) {
        throw new ForbiddenException('You are not authorized to update this item');
      }
  
      item.is_available = !item.is_available;
      return this.menuRepo.save(item);
    }
  
    async bulkCreate(
      file: Express.Multer.File,
      restaurantId: string,
      user: User,
    ): Promise<{ created: number; errors: any[] }> {
      if (!file) {
        throw new BadRequestException('CSV file is required.');
      }
      if (!restaurantId) {
        throw new BadRequestException('restaurant_id is required.');
      }
  
      if (user.role !== UserRole.OWNER && user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Only owners or admins can create menu items');
      }
  
      const restaurant = await this.restRepo.findOne({
        where: { id: restaurantId },
        relations: ['owner'],
      });
      if (!restaurant) throw new NotFoundException('Restaurant not found');
  
      if (user.role !== UserRole.ADMIN && restaurant.owner.id !== user.id) {
        throw new ForbiddenException(
          'You are not authorized to add items to this restaurant',
        );
      }
  
      const csvFile = fs.readFileSync(file.path, 'utf8');
      const parsed = Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
      });
  
      const menuItemsToCreate: Partial<MenuItem>[] = [];
      const errors = [];
  
      for (const row of parsed.data as any[]) {
        // Basic validation
        if (!row.name || !row.price) {
          errors.push({ row, error: 'Missing required fields: name, price' });
          continue;
        }
  
        const price = parseFloat(row.price);
        if (isNaN(price) || price < 0) {
          errors.push({ row, error: 'Invalid price' });
          continue;
        }
  
        menuItemsToCreate.push({
          name: row.name,
          description: row.description,
          caution: row.caution,
          price: price,
          item_type: row.item_type,
          tax: row.tax ? parseFloat(row.tax) : undefined,
          image: row.image,
          category: row.category,
          is_available: ['true', '1', 'yes'].includes(row.is_available?.toLowerCase()) ?? true,
          restaurant,
        });
      }
  
      const createdItems = await this.menuRepo.save(menuItemsToCreate);
      fs.unlinkSync(file.path); // Clean up the uploaded file
  
      return { created: createdItems.length, errors };
    }
  }
