import { Injectable } from '@nestjs/common';
import { ICallbackMessageStatus } from 'src/controller/interfaces';
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

export type ErrorData = {
  status: ICallbackMessageStatus;
  error: any;
};

export type SuccessData = {
  status: ICallbackMessageStatus;
  data?: Doc | DocItem | Doc[] | DocItem[];
};

@Injectable()
export class DocService {
  docList: DocList = new DocList(this);
  docCard: DocCard = new DocCard(this);
  docItemDetail: DocItemDetail = new DocItemDetail(this);
  docItemCard: DocItemCard = new DocItemCard(this);

  // DOC
  async getAllDoc(): Promise<SuccessData | ErrorData> {
    const payload = await query(
      new Request(this.docList.operations.selectData),
    );
    if (payload.status === ICallbackMessageStatus.Done) {
      return {
        status: payload.status,
        data: payload.data.map((item) => {
          return {
            id: item.id,
            number: item.s_number,
            date: item.d_date,
            sum: item.f_sum,
            description: item.s_description,
          };
        }),
      };
    }
    return { status: payload.status, error: payload.error };
  }

  async getOneDoc(idDoc: number): Promise<SuccessData | ErrorData> {
    const payload = await query(
      new Request(this.docCard.operations.selectData, false, { id: idDoc }),
    );
    if (payload.status === ICallbackMessageStatus.Done) {
      const item = payload.data[0];
      return {
        status: payload.status,
        data: {
          id: item?.id,
          number: item?.s_number,
          date: item?.d_date,
          sum: item?.f_sum,
          description: item?.s_description,
        },
      };
    }
    return { status: payload.status, error: payload.error };
  }

  async createDoc(
    createDocDto: CreateDocDto,
  ): Promise<SuccessData | ErrorData> {
    const requests = [
      new Request(this.docCard.operations.insertRecord, true),
      new Request(this.docCard.operations.updateRecord, true, {
        id: '$(id)',
        number: createDocDto.number,
        date: createDocDto.date,
        description: createDocDto.description,
      }),
    ];
    const payload = await query(requests);
    if (payload.status === ICallbackMessageStatus.Done) {
      return { status: payload.status };
    }
    return { status: payload.status, error: payload.error };
  }

  async updateDoc(
    updateDocDto: UpdateDocDto,
  ): Promise<SuccessData | ErrorData> {
    const payload = await query(
      new Request(this.docCard.operations.updateRecord, true, {
        id: updateDocDto.id,
        number: updateDocDto.number,
        date: updateDocDto.date,
        description: updateDocDto.description,
      }),
    );
    if (payload.status === ICallbackMessageStatus.Done) {
      return { status: payload.status };
    }
    return { status: payload.status, error: payload.error };
  }

  async deleteDoc(idDoc: number): Promise<SuccessData | ErrorData> {
    const payload = await query(
      new Request(this.docList.operations.deleteRecord, true, { id: idDoc }),
    );
    if (payload.status === ICallbackMessageStatus.Done) {
      return { status: payload.status };
    }
    return { status: payload.status, error: payload.error };
  }

  // DOC_ITEM
  async getAllDocItem(idDoc: number): Promise<SuccessData | ErrorData> {
    const payload = await query(
      new Request(this.docItemDetail.operations.selectData, false, {
        idDoc: idDoc,
      }),
    );
    if (payload.status === ICallbackMessageStatus.Done) {
      return {
        status: payload.status,
        data: payload.data.map((item) => {
          return {
            id: item.id,
            idDoc: item.id_doc,
            number: item.s_number,
            caption: item.s_caption,
            sum: item.f_sum,
            order: item.n_order,
          };
        }),
      };
    }
    return { status: payload.status, error: payload.error };
  }

  async getOneDocItem(
    idDoc: number,
    idDocItem: number,
  ): Promise<SuccessData | ErrorData> {
    const payload = await query(
      new Request(this.docItemCard.operations.selectData, false, {
        idDoc: idDoc,
        idDocItem: idDocItem,
      }),
    );
    if (payload.status === ICallbackMessageStatus.Done) {
      const item = payload.data[0];
      return {
        status: payload.status,
        data: {
          id: item?.id,
          idDoc: item?.id_doc,
          number: item?.s_number,
          caption: item?.s_caption,
          sum: item?.f_sum,
          order: item?.n_order,
        },
      };
    }
    return { status: payload.status, error: payload.error };
  }

  async createDocItem(
    createDocItemDto: CreateDocItemDto,
  ): Promise<SuccessData | ErrorData> {
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

    const payload = await query(requests);
    if (payload.status === ICallbackMessageStatus.Done) {
      return { status: payload.status };
    }
    return { status: payload.status, error: payload.error };
  }

  async updateDocItem(
    updateDocItemDto: UpdateDocItemDto,
  ): Promise<SuccessData | ErrorData> {
    const payload = await query(
      new Request(this.docItemCard.operations.updateRecord, true, {
        id: updateDocItemDto.id,
        idDoc: updateDocItemDto.doc,
        number: updateDocItemDto.number,
        caption: updateDocItemDto.caption,
        sum: updateDocItemDto.sum,
        order: updateDocItemDto.order,
      }),
    );
    if (payload.status === ICallbackMessageStatus.Done) {
      return { status: payload.status };
    }
    return { status: payload.status, error: payload.error };
  }

  async deleteDocItem(idDocItem: number): Promise<SuccessData | ErrorData> {
    const payload = await query(
      new Request(this.docItemDetail.operations.deleteRecord, true, { id: idDocItem }),
    );
    if (payload.status === ICallbackMessageStatus.Done) {
      return { status: payload.status };
    }
    return { status: payload.status, error: payload.error };
  }
}
