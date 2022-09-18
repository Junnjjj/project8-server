import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductFile {
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
