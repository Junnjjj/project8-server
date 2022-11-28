import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class ProductFavorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.productFavorites)
  product: Product;

  @ManyToOne(() => User, (user) => user.productFavorites)
  user: User;
}
