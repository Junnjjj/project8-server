import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  // @Column()
  // outdate: string;
  //
  // @Column()
  // ssn: string;
  //
  // @Column()
  // remark: string;
}
