import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  location: string;

  @Column({ length: 15, nullable: true })
  tel: string;

  @Column()
  photoImg: string;

  // // 입찰 중인 물건
  // @Column()
  // biddingProduct: number[];
  //
  // // 판매 중인 물건
  // @Column()
  // sellingProduct: number[];
}
