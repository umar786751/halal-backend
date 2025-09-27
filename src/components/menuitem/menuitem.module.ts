import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from '../../database/entities/menu.items.entity';
import { Restaurant } from '../../database/entities/restraunt.entity';
import { MenuitemController } from './menuitem.controller';
import { MenuitemService } from './menuitem.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem, Restaurant])],
  controllers: [MenuitemController],
  providers: [MenuitemService],
  exports: [MenuitemService],
})
export class MenuitemModule {}
