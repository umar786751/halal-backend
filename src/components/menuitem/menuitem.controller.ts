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
    UseInterceptors,
    UploadedFile,
  } from '@nestjs/common';
  import { MenuitemService } from './menuitem.service';
  import { CreateMenuItemDto } from './dto/create-menu-item.dto';
  import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
  import { UserAuthGuard } from '../auth/user-auth.guard'; // 👈 1. IMPORT THE NEW GUARD
  import { FileInterceptor } from '@nestjs/platform-express';
  
  @Controller('menuitems')
  export class MenuitemController {
    constructor(private readonly menuItemsService: MenuitemService) {}
  
    @Get()
    async findAll(@Query() query: any) {
      return this.menuItemsService.findAll(query);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.menuItemsService.findById(id);
    }
    
    // 👇 2. USE THE CORRECT GUARD ON ALL PROTECTED ROUTES
    @UseGuards(UserAuthGuard)
    @Post()
    async create(@Body() dto: CreateMenuItemDto, @Request() req: any) {
      return this.menuItemsService.create(dto, req.user);
    }
  
    @UseGuards(UserAuthGuard)
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() dto: UpdateMenuItemDto,
      @Request() req: any,
    ) {
      return this.menuItemsService.update(id, dto, req.user);
    }
  
    @UseGuards(UserAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req: any) {
      return this.menuItemsService.delete(id, req.user);
    }

    @UseGuards(UserAuthGuard)
    @Put(':id/status')
    async updateStatus(@Param('id') id: string, @Request() req: any) {
      return this.menuItemsService.updateStatus(id, req.user);
    }
  
    @UseGuards(UserAuthGuard)
    @Post('bulk-upload')
    @UseInterceptors(FileInterceptor('file'))
    async bulkUpload(
      @UploadedFile() file: Express.Multer.File,
      @Body('restaurant_id') restaurantId: string,
      @Request() req: any,
    ) {
      return this.menuItemsService.bulkCreate(file, restaurantId, req.user);
    }
  }