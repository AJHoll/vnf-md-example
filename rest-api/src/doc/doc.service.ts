import { Injectable } from '@nestjs/common';
import { DocCard, DocList } from 'src/datasets';
import { query } from '../controller';
import { Request } from '../controller/classes/Request';

type Doc = {
  id: Number;
  number: String;
  date: Date;
  sum: Number;
  description: String;
};

@Injectable()
export class DocService {
  docList: DocList = new DocList(this);
  docCard: DocCard = new DocCard(this);

  async getAllDoc(): Promise<Doc[]> {
    const payload = await query(
      new Request(this.docList.operations.selectData),
    );
    return payload.data.map((item) => {
      return {
        id: item.id,
        number: item.s_number,
        date: item.d_date,
        sum: item.f_sum,
        description: item.s_description,
      };
    });
  }

  async getOneDoc(idDoc: number): Promise<Doc> {
    const payload = await query(
      new Request(this.docCard.operations.selectData, false, { id: idDoc }),
    );
    const item = payload.data[0];
    return {
      id: item.id,
      number: item.s_number,
      date: item.d_date,
      sum: item.f_sum,
      description: item.s_description,
    };
  }
}
