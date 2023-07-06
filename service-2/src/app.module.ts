import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Group } from './groups/entity/group.entity';
import { Form } from './forms/entity/form.entity';
import { User } from './user/entity/user.entity';
import { Student } from './student/entity/student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './type.orm.config.service';
import { FormModule } from './forms/form.module';
import { GroupModule } from './groups/group.module';
import { HistoryEntity } from './history/entity/history.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    TypeOrmModule.forFeature([
      Group,
      Form,
      User,
      Student,
      HistoryEntity,
    ]),
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
    FormModule,
    GroupModule,
  ],
  exports: [ClientsModule, TypeOrmModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
