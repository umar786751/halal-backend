import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Request,
    UseGuards,
  } from '@nestjs/common';
  import { RestrauntService } from './restraunt.service';
  import { CreateRestaurantDto } from './dto/create-restraunt.dto';
  import { UpdateRestaurantDto } from './dto/update-restraunt.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';
  
  @Controller('restaurants')
  export class RestrauntController {
    constructor(private readonly restrauntService: RestrauntService) {}
  
    // Get all restaurants (with filters like cuisine, city, rating)
    @Get()
    async findAll(@Query() query: any) {
      return this.restrauntService.findAll(query);
    }
  
    // Get one restaurant by ID
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.restrauntService.findById(id);
    }
  
    // Create restaurant (owner only)
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
      @Body() createRestaurantDto: CreateRestaurantDto,
      @Request() req: any,
    ) {
      return this.restrauntService.create(createRestaurantDto, req.user);
    }
  
    // Update restaurant details
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateRestaurantDto: UpdateRestaurantDto,
      @Request() req: any,
    ) {
      return this.restrauntService.update(id, updateRestaurantDto, req.user);
    }
  
    // Delete restaurant
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req: any) {
      return this.restrauntService.delete(id, req.user);
    }
  
    // Update restaurant status (active/inactive)
    @UseGuards(JwtAuthGuard)
    @Put(':id/status')
    async updateStatus(@Param('id') id: string, @Request() req: any) {
      return this.restrauntService.updateStatus(id, req.user);
    }
  }
