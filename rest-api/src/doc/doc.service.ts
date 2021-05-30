import { Injectable } from '@nestjs/common';

@Injectable()
export class DocService {
  async getAllDoc(): Promise<any | any[]> {
    return { id: 1 };
  }

  async getOneDoc(id: number): Promise<any> {
    return { id: id };
  }
}
