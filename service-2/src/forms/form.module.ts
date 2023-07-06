import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { Group } from '../groups/entity/group.entity';
import { Form } from './entity/form.entity';
import { User } from '../user/entity/user.entity';
import { Student } from '../student/entity/student.entity';
import { HistoryEntity } from '../history/entity/history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Group,
      Form,
      User,
      Student,
      HistoryEntity,
    ]),
  ],
  exports: [TypeOrmModule],
  providers: [FormService],
  controllers: [FormController],
})
export class FormModule {}
