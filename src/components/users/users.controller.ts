import { Controller, Get, Post, Body, Request, Param, Delete, UseGuards, Put, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.gaurd';
import { SignupOwnerDto } from '../restraunt/dto/signup-owner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Post('signup-owner')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        full_name: { type: 'string' },
        business_email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        mobile_number: { type: 'string' },
        business_name: { type: 'string' },
        business_type: { type: 'string' },
        business_category: { type: 'string' },
        business_cuisine: { type: 'string' },
        branch_count: { type: 'number' },
        business_address: { type: 'string' },
        building_name: { type: 'string' },
        house_number: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        area: { type: 'string' },
        tax_registration_number: { type: 'string' },
        image: { type: 'string', format: 'binary' }, // 👈 file
      },
    },
  })
  async signupOwner(
    @Body() signupDto: SignupOwnerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.signupOwner(signupDto, file);
  }


  // GET all users (admin only, with filters)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: any, @Request() req: any) {
    return this.usersService.findAll(query);
  }

  // GET one user
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  // CREATE user (admin only)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateUserDto, @Request() req: any) {
    return this.usersService.create(dto, req.user);
  }

  // UPDATE user (self or admin)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Request() req: any,
  ) {
    return this.usersService.update(id, dto, req.user);
  }

  // DELETE user (admin only)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.usersService.delete(id, req.user);
  }

  // TOGGLE status (active/inactive)
  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Request() req: any) {
    return this.usersService.updateStatus(id, req.user);
  }
}
