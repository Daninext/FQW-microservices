import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './student/entity/student.entity';
import { Form } from './forms/entity/form.entity';
import { Group } from './groups/entity/group.entity';
import { Status } from './forms/entity/status.enum';
import { ChangeFormReq } from './forms/createFormReq';
import { Matrix } from './forms/entity/matrix';
import { HistoryEntity } from './history/entity/history.entity';
import { HistoryJsonForm } from './history/entity/history.jsonform';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Form)
    private formRepository: Repository<Form>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(HistoryEntity)
    private historyRepository: Repository<HistoryEntity>,
  ) {}

  async create(json: string) {
    const form = JSON.parse(json);
    const dbform = await this.formRepository.findOne({
      where: { id: form.id },
    });

    if (dbform == null) return;

    const history = new HistoryEntity();
    history.type = 'create';

    if ((await this.studentRepository.findBy({ fullName: form.fields['fullName'], })).length === 0 ||
      (await this.groupRepository.findBy({ name: form.fields['group'] })).length === 0) {
      dbform.comment = 'Некорректный студент или группа';
      dbform.status = Status.Returned;
    } else if ((await this.formRepository.find({ where: { fullName: form.fields['fullName'], status: Status.Approved, }, })
      ).length > 0) {
      dbform.comment = 'У переданного студента уже есть утвержденная заявка';
      dbform.status = Status.Rejected;
    } else if ((await this.formRepository.find({ where: { theme: form.fields['theme'] }, })).length > 1) {
      dbform.comment = 'Такая тема уже существует в системе';
      dbform.status = Status.Returned;
    } else {
      dbform.status = Status.ApprovalProcess;
    }

    history.date = form.createDate;
    history.form = dbform;
    const historyForm: HistoryJsonForm = {};
    historyForm['fullName'] = { from: '', to: form.fields['fullName'] };
    historyForm['companyName'] = { from: '', to: form.fields['companyName'] };
    historyForm['consultant'] = { from: '', to: form.fields['consultant'] };
    historyForm['group'] = { from: '', to: form.fields['group'] };
    historyForm['theme'] = { from: '', to: form.fields['theme'] };
    history.body = JSON.stringify(historyForm);

    await this.formRepository.save(dbform);
    await this.historyRepository.save(history);
  }

  async change(json: string) {
    const form = JSON.parse(json);
    const dbform = await this.formRepository.findOne({
      where: { id: form.id },
    });

    if (dbform == null) return;
    if (dbform.status == Status.Rejected || dbform.status == Status.Approved)
      return;

    const history = new HistoryEntity();
    history.type = 'change';
    history.form = dbform;
    history.date = form.updateDate;
    const historyForm: HistoryJsonForm = {};
    dbform.comment = '';

    if (form.changedFields['fullName'] != undefined) {
      historyForm['fullName'] = {
        from: dbform.fullName,
        to: form.changedFields['fullName'],
      };
      dbform.fullName = form.changedFields['fullName'];
    }
    if (form.changedFields['group'] != undefined) {
      historyForm['group'] = {
        from: dbform.group,
        to: form.changedFields['group'],
      };
      dbform.group = form.changedFields['group'];
    }
    if (form.changedFields['theme'] != undefined) {
      historyForm['theme'] = {
        from: dbform.theme,
        to: form.changedFields['theme'],
      };
      dbform.theme = form.changedFields['theme'];
    }
    if (form.changedFields['companyName'] != undefined) {
      historyForm['companyName'] = {
        from: dbform.companyName,
        to: form.changedFields['companyName'],
      };
      dbform.companyName = form.changedFields['companyName'];
    }
    if (form.changedFields['consultant'] != undefined) {
      historyForm['consultant'] = {
        from: dbform.consultant.toString(),
        to: form.changedFields['consultant'],
      };
      dbform.consultant = form.changedFields['consultant'];
    }

    let statusChanged = false;
    if (form.changedFields['status'] != undefined) {
      const stages = await new Matrix().getGoodStages(dbform.status);
      if (!stages.includes(form.changedFields['status'])) return;
      historyForm['status'] = {
        from: Status[dbform.status],
        to: form.changedFields['status'],
      };
      dbform.status =
        Status[form.changedFields['status'] as keyof typeof Status];
      statusChanged = true;
    }

    history.body = JSON.stringify(historyForm);
    await this.historyRepository.save(history);

    if (
      form.changedFields['fullName'] != undefined &&
      (await this.studentRepository.findBy({ fullName: dbform.fullName }))
        .length === 0
    ) {
      dbform.comment = 'Некорректный студент';
      dbform.status = Status.Returned;
      return await this.formRepository.save(dbform);
    }

    if (
      form.changedFields['group'] != undefined &&
      (await this.groupRepository.findBy({ name: dbform.group })).length === 0
    ) {
      dbform.comment = 'Некорректная группа';
      dbform.status = Status.Returned;
      return await this.formRepository.save(dbform);
    }

    if (form.changedFields['theme'] != undefined) {
      if (
        (
          await this.formRepository.find({
            where: { fullName: dbform.fullName, status: Status.Approved },
          })
        ).length > 0
      ) {
        dbform.comment = 'У переданного студента уже есть утвержденная заявка';
        dbform.status = Status.Rejected;
        return await this.formRepository.save(dbform);
      } else if (
        (await this.formRepository.find({ where: { theme: dbform.theme } }))
          .length > 1
      ) {
        dbform.comment = 'Такая тема уже существует в системе';
        dbform.status = Status.Returned;
        return await this.formRepository.save(dbform);
      }
    }

    if (!statusChanged) {
      historyForm['status'] = {
        from: Status[dbform.status],
        to: Status[Status.ApprovalProcess],
      };
      dbform.status = Status.ApprovalProcess;
    }

    await this.formRepository.save(dbform);
  }

  async getJson(id: number, status: string) {
    const update = new ChangeFormReq();
    const forms = await this.formRepository.find({ where: { id: id } });

    if (forms.length === 0) return;

    const form = forms[0];
    update.id = form.id;
    update.changedFields = {
      status: status,
    };
    update.updateDate = new Date().toISOString();

    return JSON.stringify(update);
  }
}
