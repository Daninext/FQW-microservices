export class CreateFormReq {
  id: number;
  fields: Field;
  createDate: string;
}

export class ChangeFormReq {
  id: number;
  changedFields: Field;
  updateDate: string;
}

export class Field {
  [key: string]: string;
}
