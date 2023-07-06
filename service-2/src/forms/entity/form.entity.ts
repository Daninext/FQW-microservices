import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Status } from './status.enum';

@Entity()
export class Form {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  companyName: string;

  @Column({ default: false })
  consultant: boolean;

  @Column({ default: Status.New })
  status: Status;

  @Column()
  group: string;

  @Column()
  theme: string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @Column()
  comment: string;

  @Column()
  create: string;
}
