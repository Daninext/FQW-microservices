import { Module } from '@nestjs/common';
import { FormController } from './form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entity/group.entity';
import { Form } from './entity/form.entity';
import { User } from '../user/entity/user.entity';
import { Student } from '../student/entity/student.entity';
import { FormService } from './form.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, Form, User, Student]),
    ClientsModule.register([
      {
        name: 'REQUEST_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'request_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  exports: [TypeOrmModule, ClientsModule],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
