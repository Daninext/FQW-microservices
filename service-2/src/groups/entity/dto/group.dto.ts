import { Group } from '../group.entity';

export class GroupDto {
  name: string;

  constructor(group: Group) {
    this.name = group.name;
  }
}
