import { Injectable } from '@nestjs/common';
import { DocCard, DocItemCard, DocItemDetail, DocList } from 'src/datasets';
import { query } from '../controller';
import { Request } from '../controller/classes/Request';

export type Doc = {
  id: Number;
  number: String;
  date: Date;
  sum: Number;
  description: String;
};

export type DocItem = {
  id: Number;
  idDoc: Number;
  number: String;
  caption: String;
  sum: Number;
  order: Number;
};

@Injectable()
export class DocService {
  docList: DocList = new DocList(this);
  docCard: DocCard = new DocCard(this);
  docItemDetail: DocItemDetail = new DocItemDetail(this);
  docItemCard: DocItemCard = new DocItemCard(this);

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
      id: item?.id,
      number: item?.s_number,
      date: item?.d_date,
      sum: item?.f_sum,
      description: item?.s_description,
    };
  }

  async getAllDocItem(idDoc: number): Promise<DocItem[] | any> {
    const payload = await query(
      new Request(this.docItemDetail.operations.selectData, false, {
        idDoc: idDoc,
      }),
    );
    return payload.data.map((item) => {
      return {
        id: item.id,
        idDoc: item.id_doc,
        number: item.s_number,
        caption: item.s_caption,
        sum: item.f_sum,
        order: item.n_order,
      };
    });
  }

  async getOneDocItem(idDoc: number, idDocItem: number): Promise<DocItem> {
    const payload = await query(
      new Request(this.docItemCard.operations.selectData, false, {
        idDoc: idDoc,
        idDocItem: idDocItem,
      }),
    );
    const item = payload.data[0];
    return {
      id: item?.id,
      idDoc: item?.id_doc,
      number: item?.s_number,
      caption: item?.s_caption,
      sum: item?.f_sum,
      order: item?.n_order,
    };
  }
}
