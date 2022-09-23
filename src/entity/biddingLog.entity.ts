import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity()
export class BiddingLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column({ default: true })
  biddingSuccess: boolean;

  @ManyToOne(() => Product, (product) => product.biddingLogs)
  product: Product;

  @ManyToMany(() => User, (user) => user.biddingLogs)
  user: User[];
}

// ID, 물건ID, 가격, 사용자ID
