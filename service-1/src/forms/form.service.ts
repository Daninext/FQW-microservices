import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from './entity/form.entity';
import { Repository } from 'typeorm';
import { Group } from './entity/group.entity';
import { Student } from '../student/entity/student.entity';
import { FormDto } from './entity/dto/form.dto';
import { Status } from './entity/status.enum';
import { ChangeFormReq, CreateFormReq } from './createFormReq';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '../user/entity/user.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form)
    private formRepository: Repository<Form>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject('REQUEST_SERVICE') private client: ClientProxy,
  ) {}

  async getForms(page: number, outerID: string) {
    if (page < 1) return { page: 0, ans: [] };

    const forms = await this.formRepository.find({
      where: { user: { outerId: outerID } },
    });

    const transfer = [];
    let _count = 0;
    for (let i = 20 * (page - 1); i < forms.length && _count < 20; ++i) {
      transfer.push(new FormDto(forms[i]));
      ++_count;
    }

    return { page: page, ans: transfer };
  }

  async postNewForm(dto: FormDto, outerID: string) {
    const createDate = new Date();

    let form = new Form();
    form.fullName = dto.fullName;
    form.companyName = dto.companyName;
    form.consultant = Boolean(dto.consultant);
    form.group = dto.group;
    form.theme = dto.theme;
    form.status = Status.New;
    form.comment = '';
    let month = '';
    if (createDate.getMonth() < 10) month = '0';
    month += createDate.getMonth() + 1;
    form.create =
      createDate.getFullYear() + '-' + month + '-' + createDate.getDate();

    form.user = await this.userRepository.findOneBy({ outerId: outerID });

    form = await this.formRepository.save(form);

    const create = new CreateFormReq();
    create.id = form.id;
    create.fields = {
      fullName: dto.fullName,
      companyName: dto.companyName,
      consultant: Boolean(dto.consultant).toString(),
      group: dto.group,
      theme: dto.theme,
    };

    create.createDate = createDate.toISOString();

    await this.sendCreateMessage(JSON.stringify(create), form);

    await this.formRepository.save(form);
  }

  async changeForm(dto: FormDto, outerID: string) {
    const update = new ChangeFormReq();
    const forms = await this.formRepository.find({
      where: { id: dto.id, user: { outerId: outerID } },
    });

    if (forms.length === 0) return;

    let changed = false;
    const form = forms[0];
    update.id = form.id;
    update.changedFields = {};
    if (form.fullName != dto.fullName) {
      update.changedFields['fullName'] = dto.fullName;
      changed = true;
    }
    if (form.companyName != dto.companyName) {
      update.changedFields['companyName'] = dto.companyName;
      changed = true;
    }
    if (Boolean(form.consultant) != Boolean(dto.consultant)) {
      update.changedFields['consultant'] = Boolean(dto.consultant).toString();
      changed = true;
    }
    if (form.group != dto.group) {
      update.changedFields['group'] = dto.group;
      changed = true;
    }
    if (form.theme != dto.theme) {
      update.changedFields['theme'] = dto.theme;
      changed = true;
    }
    update.updateDate = new Date().toISOString();

    if (!changed) return;

    await this.sendChangeMessage(JSON.stringify(update));
  }

  async changeStatus(status: string, id: number, outerID: string) {
    if (Status[status] == undefined) return;
    if (
      (
        await this.formRepository.find({
          where: { id: id, user: { outerId: outerID } },
        })
      ).length === 0
    )
      return;

    const update = new ChangeFormReq();
    update.id = id;
    update.changedFields = {};
    update.changedFields['status'] = Status[status];
    update.updateDate = new Date().toISOString();

    await this.sendChangeMessage(JSON.stringify(update));
  }

  async sendCreateMessage(json: string, form) {
    await this.client.connect().then(async () => {
      form.status = Status.SendForApproval;
      await this.formRepository.save(form);
    });
    this.client.emit('create', json);
  }

  async sendChangeMessage(json: string) {
    await this.client.connect();
    this.client.emit('change', json);
  }
}
