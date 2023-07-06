import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../student/entity/student.entity';
import { Form } from './entity/form.entity';
import { FormDto } from './entity/dto/form.dto';
import { Group } from '../groups/entity/group.entity';
import { Status } from './entity/status.enum';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private formRepository: Repository<Form>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async getForms(page: number) {
    if (page < 1) return { page: 0, ans: [] };

    const forms = await this.formRepository.find();

    const transfer = [];
    let _count = 0;
    for (let i = 20 * (page - 1); i < forms.length && _count < 20; ++i) {
      const dto = new FormDto(forms[i]);
      await dto.setStages(forms[i]);
      transfer.push(dto);
      ++_count;
    }

    return { page: page, ans: transfer };
  }

  async getFormsBy(type: string, req: string, page: number) {
    if (page < 1) return { page: 0, ans: [] };

    let forms;
    switch (type) {
      case 'status':
        if (Status[req] != undefined)
          forms = await this.formRepository.findBy({ status: Status[req] });
        else forms = [];
        break;
      case 'theme':
        forms = await this.formRepository.findBy({ theme: req });
        break;
      case 'group':
        forms = await this.formRepository.findBy({ group: req });
        break;
      case 'fullName':
        forms = await this.formRepository.findBy({ fullName: req });
        break;
      case 'date':
        forms = await this.formRepository.findBy({ create: req });
        break;
    }

    const transfer = [];
    let _count = 0;
    for (let i = 20 * (page - 1); i < forms.length && _count < 20; ++i) {
      const dto = new FormDto(forms[i]);
      await dto.setStages(forms[i]);
      transfer.push(dto);
      ++_count;
    }

    return { page: page, ans: transfer };
  }
}
