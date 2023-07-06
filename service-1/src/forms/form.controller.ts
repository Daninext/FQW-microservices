import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Render,
  UseGuards,
} from '@nestjs/common';
import { FormService } from './form.service';
import { FormDto } from './entity/dto/form.dto';
import { AuthGuard } from '../auth/strategy/auth.guard';
import { Session } from '../auth/strategy/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Controller('/forms')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Get('')
  @Render('main')
  @UseGuards(new AuthGuard())
  root() {
    return;
  }

  @Get('/page/:page')
  @UseGuards(new AuthGuard())
  async getForms(
    @Session() session: SessionContainer,
    @Param('page', ParseIntPipe) page: number,
  ) {
    return await this.formService.getForms(page, session.getUserId());
  }

  @Post('/post')
  @UseGuards(new AuthGuard())
  async postForm(@Session() session: SessionContainer, @Body() form: FormDto) {
    return await this.formService.postNewForm(form, session.getUserId());
  }

  @Put('/change')
  @UseGuards(new AuthGuard())
  async changeForm(
    @Session() session: SessionContainer,
    @Body() form: FormDto,
  ) {
    return await this.formService.changeForm(form, session.getUserId());
  }

  @Put('/new-status/:status/id/:id')
  @UseGuards(new AuthGuard())
  async changeStatus(
    @Session() session: SessionContainer,
    @Param('status') status: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.formService.changeStatus(status, id, session.getUserId());
  }
}
