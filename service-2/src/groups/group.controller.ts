import { Controller, Get, Param, ParseIntPipe, Render } from '@nestjs/common';
import { GroupService } from './group.service';

@Controller('/groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get('')
  @Render('groups')
  async show() {
    return;
  }

  @Get('/page/:page')
  async getGroups(@Param('page', ParseIntPipe) page: number) {
    return await this.groupService.getGroups(page);
  }

  @Get('/by/:req/page/:page')
  async getGroupsBy(
    @Param('req') req: string,
    @Param('page', ParseIntPipe) page: number,
  ) {
    return await this.groupService.getGroupsBy(req, page);
  }
}
