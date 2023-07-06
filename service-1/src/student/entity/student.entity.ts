import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Group } from '../../forms/entity/group.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @ManyToOne(() => Group, { eager: true })
  group: Group;
}
