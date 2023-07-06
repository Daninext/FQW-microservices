import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  outerId: string;

  @Column()
  username: string;

  @Column({ default: true })
  isActive: boolean;

  constructor(outerId: string, username: string) {
    this.username = username;
    this.outerId = outerId;
  }

  setUsername(username: string) {
    this.username = username;
  }
}
