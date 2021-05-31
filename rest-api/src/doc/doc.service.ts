import { Injectable } from '@nestjs/common';
import { DocCard, DocItemCard, DocItemDetail, DocList } from 'src/datasets';
import { query } from '../controller';
import { Request } from '../controller/classes/Request';
import { CreateDocItemDto } from './dto/create-doc-item.dto';
import { CreateDocDto } from './dto/create-doc.dto';
import { UpdateDocItemDto } from './dto/update-doc-item.dto';
import { UpdateDocDto } from './dto/update-doc.dto';

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

  // DOC
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

  async createDoc(createDocDto: CreateDocDto): Promise<void> {
    const requests = [
      new Request(this.docCard.operations.insertRecord, true),
      new Request(this.docCard.operations.updateRecord, true, {
        id: '$(id)',
        number: createDocDto.number,
        date: createDocDto.date,
        description: createDocDto.description,
      }),
    ];
    await query(requests);
  }

  async updateDoc(updateDocDto: UpdateDocDto): Promise<void> {
    await query(
      new Request(this.docCard.operations.updateRecord, true, {
        id: updateDocDto.id,
        number: updateDocDto.number,
        date: updateDocDto.date,
        description: updateDocDto.description,
      }),
    );
  }

  async deleteDoc(idDoc: number): Promise<void> {
    await query(
      new Request(this.docList.operations.deleteRecord, true, { id: idDoc }),
    );
  }

  // DOC_ITEM
  async getAllDocItem(idDoc: number): Promise<DocItem[]> {
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

  async createDocItem(createDocItemDto: CreateDocItemDto): Promise<void> {
    console.log(createDocItemDto);
    const requests = [
      new Request(this.docItemCard.operations.insertRecord, true, {
        idDoc: createDocItemDto.doc,
      }),
      new Request(this.docItemCard.operations.updateRecord, true, {
        id: '$(id)',
        idDoc: createDocItemDto.doc,
        number: createDocItemDto.number,
        caption: createDocItemDto.caption,
        sum: createDocItemDto.sum,
      }),
    ];

    await query(requests);
  }

  async updateDocItem(updateDocItemDto: UpdateDocItemDto): Promise<void> {
    await query(
      new Request(this.docItemCard.operations.updateRecord, true, {
        id: updateDocItemDto.id,
        idDoc: updateDocItemDto.doc,
        number: updateDocItemDto.number,
        caption: updateDocItemDto.caption,
        sum: updateDocItemDto.sum,
        order: updateDocItemDto.order,
      }),
    );
  }
}
