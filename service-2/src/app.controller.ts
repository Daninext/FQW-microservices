import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Redirect,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  @Redirect('/forms')
  redirect() {
    return;
  }

  @EventPattern('create')
  async create(@Payload() data: string, @Ctx() context: RmqContext) {
    await this.appService.create(data);
  }

  @EventPattern('change')
  async change(@Payload() data: string, @Ctx() context: RmqContext) {
    await this.appService.change(data);
  }

  @Put('/change/:id/new-status/:status')
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: string,
  ) {
    await this.change(await this.appService.getJson(id, status), null);
  }
}
