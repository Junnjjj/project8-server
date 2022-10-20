import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
  JoinTable,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity()
export class BiddingLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column({ default: false })
  biddingSuccess: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @Column({ default: true })
  message: boolean;

  @Column({ type: 'tinyint', default: 0 })
  shipping: number;

  @ManyToOne(() => Product, (product) => product.biddingLogs)
  product: Product;

  @ManyToOne(() => User, (user) => user.biddingLogs)
  user: User;
}
