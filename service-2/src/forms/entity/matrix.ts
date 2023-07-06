import * as fsPromise from 'fs/promises';
import { Status } from './status.enum';

export class Matrix {
  async getMatrix() {
    const matrix = new Array(6).fill(false).map(() => new Array(6).fill(false));

    const file = await fsPromise.open('./public/matrix.txt', 'r');
    for await (const line of file.readLines()) {
      const vars = line.split(' ');
      matrix[Status[vars[0]]][Status[vars[1]]] = true;
    }

    await file.close();
    return matrix;
  }

  async getGoodStages(from: Status) {
    const stages = [];
    const matrix = await this.getMatrix();
    for (let i = 0; i < 6; ++i) {
      if (matrix[from][i]) stages.push(Status[i]);
    }

    return stages;
  }
}
