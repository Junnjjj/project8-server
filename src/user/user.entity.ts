import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  loginId: string;

  @Column()
  passwd: string;

  @Column()
  name: string;

  // @Column()
  // createdate: string;

  @Column()
  tel1: number;

  @Column()
  tel2: number;

  @Column()
  tel3: number;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  // @Column()
  // outdate: string;
  //
  // @Column()
  // ssn: string;
  //
  // @Column()
  // remark: string;
}
