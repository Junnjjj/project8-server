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
  startprice: string;

  @Column()
  endtime: string;

  @Column()
  owner: number;

  // @Column()
  // id: string
  //
  // @Column()
  // createDate: string
  //
  // @Column()
  // buyer: string
}
