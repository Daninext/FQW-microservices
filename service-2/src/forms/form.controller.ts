import { Controller, Get, Param, ParseIntPipe, Put, Render } from "@nestjs/common";
import { FormService } from './form.service';

@Controller('/forms')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Get('')
  @Render('forms')
  async show() {
    return;
  }

  @Get('/page/:page')
  async getForms(@Param('page', ParseIntPipe) page: number) {
    return await this.formService.getForms(page);
  }

  @Get('/by/:type/:req/page/:page')
  async getFormsBy(
    @Param('type') type: string,
    @Param('req') req: string,
    @Param('page', ParseIntPipe) page: number,
  ) {
    return this.formService.getFormsBy(type, req, page);
  }
}
