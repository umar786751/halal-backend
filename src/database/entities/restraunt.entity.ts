import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { MenuItem } from './menu.items.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';
import { Deal } from './deal.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  banner_image: string;

  @Column({ type: 'varchar', length: 50 })
  cuisine_type: string; // e.g., "Pakistani", "Pizza", "Italian"

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  street_address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zip_code: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'float', default: 0 })
  average_rating: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.restaurants, { onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.restaurant)
  menu_items: MenuItem[];

  @OneToMany(() => Order, (order) => order.restaurant)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.restaurant)
  reviews: Review[];

  @OneToMany(() => Deal, (deal) => deal.restaurant)
  deals: Deal[];

  @Column({ nullable: true })
  business_type: string; // e.g. Restaurant, Cafe, Bakery

  @Column({ nullable: true })
  category: string; // e.g. Fast Food, Fine Dining

  @Column({ type: 'int', nullable: true })
  branch_count: number;

  @Column({ nullable: true })
  building_name: string;

  @Column({ nullable: true })
  house_number: string;

  @Column({ nullable: true })
  area: string;

  @Column({ nullable: true })
  tax_registration_number: string;

  @Column({ nullable: true })
  id_proof_type: string;

  @Column({ nullable: true })
  id_proof_file: string; // path/URL to uploaded file
}
