import { Form } from '../form.entity';
import { Status } from '../status.enum';

export class FormDto {
  id: number;
  fullName: string;
  companyName: string;
  consultant: boolean;
  status: string;
  group: string;
  theme: string;
  comment: string;

  constructor(form: Form) {
    this.id = form.id;
    this.fullName = form.fullName;
    this.companyName = form.companyName;
    this.consultant = form.consultant;
    this.status = Status[form.status];
    this.group = form.group;
    this.theme = form.theme;
    this.comment = form.comment;
  }
}
