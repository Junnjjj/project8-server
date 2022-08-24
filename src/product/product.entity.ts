import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
  startPrice: number;

  @Column()
  endtime: string;

  @Column()
  owner: string;

  // @Column()
  // id: string
  //
  // @Column()
  // createDate: string
  //
  // @Column()
  // buyer: string
}
