import { Form } from '../form.entity';
import { Status } from '../status.enum';
import { Matrix } from '../matrix';

export class FormDto {
  id: number;
  fullName: string;
  companyName: string;
  consultant: boolean;
  status: string;
  group: string;
  theme: string;
  stages: string[];

  constructor(form: Form) {
    this.id = form.id;
    this.fullName = form.fullName;
    this.companyName = form.companyName;
    this.consultant = form.consultant;
    this.status = Status[form.status];
    this.group = form.group;
    this.theme = form.theme;
  }

  async setStages(form: Form) {
    this.stages = await new Matrix().getGoodStages(form.status);
  }
}
