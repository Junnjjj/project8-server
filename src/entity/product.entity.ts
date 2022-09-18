import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductFile } from './productFile.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  etype: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  startprice: string;

  @Column()
  endtime: string;

  @Column()
  owner: number;

  @OneToMany(() => ProductFile, (productFile) => productFile.product)
  productFiles: ProductFile[];
}
