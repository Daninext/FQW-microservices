import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entity/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group])],
  exports: [TypeOrmModule],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
