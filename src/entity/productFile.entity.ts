import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imgURL: string;

  @Column()
  originalName: string;

  @Column()
  fileName: string;

  @Column({ default: false })
  active: boolean;

  @ManyToOne(() => Product, (product) => product.productFiles, {
    nullable: true,
  })
  product: Product;
}
