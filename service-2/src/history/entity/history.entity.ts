import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Form } from '../../forms/entity/form.entity';

@Entity()
export class HistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  date: string;

  @Column()
  body: string;

  @ManyToOne(() => Form, { eager: true })
  form: Form;
}
