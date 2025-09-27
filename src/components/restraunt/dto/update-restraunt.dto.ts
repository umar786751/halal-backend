import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantDto } from './create-restraunt.dto';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}
