import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { parse } from 'pg-connection-string';
import { Group } from './groups/entity/group.entity';
import { Form } from './forms/entity/form.entity';
import { User } from './user/entity/user.entity';
import { Student } from './student/entity/student.entity';
import { HistoryEntity } from './history/entity/history.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const config = parse(process.env.DATABASE_URL);

    return {
      type: 'postgres',
      host: config.host,
      port: Number(config.port),
      username: config.user,
      password: config.password,
      database: config.database,
      entities: [Group, Form, User, Student, HistoryEntity],
      synchronize: true,
      autoLoadEntities: true,
      ssl: true,
    };
  }
}
