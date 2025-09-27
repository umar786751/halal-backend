import { Module } from '@nestjs/common';
import { RestrauntController } from './restraunt.controller';
import { RestrauntService } from './restraunt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from '../../database/entities/restraunt.entity';

@Module({
  controllers: [RestrauntController],
  providers: [RestrauntService],
  imports: [TypeOrmModule.forFeature([Restaurant])]
})
export class RestrauntModule {}
