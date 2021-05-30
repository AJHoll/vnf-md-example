import { Injectable } from '@nestjs/common';
import { DocCard, DocList } from 'src/datasets';
import { query } from '../controller';
import { Request } from '../controller/classes/Request';

@Injectable()
export class DocService {
  docList: DocList = new DocList(this);
  docCard: DocCard = new DocCard(this);

  async getAllDoc(): Promise<any | any[]> {
    const data = await query(new Request(this.docList.operations.selectData));
    return data;
  }

  async getOneDoc(idDoc: number): Promise<any> {
    const data = await query(
      new Request(this.docCard.operations.selectData, false, { id: idDoc }),
    );
    return data;
  }
}
