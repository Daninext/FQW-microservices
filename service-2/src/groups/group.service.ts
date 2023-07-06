import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entity/group.entity';
import { Repository } from 'typeorm';
import { GroupDto } from './entity/dto/group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  async getGroups(page: number) {
    if (page < 1) return { page: 0, ans: [] };

    const groups = await this.groupRepository.find();

    const transfer = [];
    let _count = 0;
    for (let i = 20 * (page - 1); i < groups.length && _count < 20; ++i) {
      transfer.push(new GroupDto(groups[i]));
      ++_count;
    }

    return { page: page, ans: transfer };
  }

  async getGroupsBy(req: string, page: number) {
    if (page < 1) return { page: 0, ans: [] };

    const prepare = await this.groupRepository.find();
    const groups = [];

    for (let i = 0; i < prepare.length; ++i) {
      if (prepare[i].name.includes(req)) groups.push(prepare[i]);
    }

    const transfer = [];
    let _count = 0;
    for (let i = 20 * (page - 1); i < groups.length && _count < 20; ++i) {
      transfer.push(new GroupDto(groups[i]));
      ++_count;
    }

    return { page: page, ans: transfer };
  }
}
