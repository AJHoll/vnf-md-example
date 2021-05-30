import { Controller, Get, Param } from '@nestjs/common';
import { Doc, DocItem, DocService } from './doc.service';

@Controller('doc')
export class DocController {
  constructor(private readonly docService: DocService) {}

  @Get('/')
  async getAllDoc(): Promise<Doc | Doc[]> {
    return this.docService.getAllDoc();
  }

  @Get('/:idDoc')
  async getOneDoc(@Param('idDoc') idDoc): Promise<Doc> {
    return this.docService.getOneDoc(+idDoc);
  }

  @Get('/:idDoc/item')
  async getAllDocItem(@Param('idDoc') idDoc): Promise<DocItem[]> {
    return this.docService.getAllDocItem(+idDoc);
  }

  @Get('/:idDoc/item/:idDocItem')
  async getOneDocItem(
    @Param('idDoc') idDoc,
    @Param('idDocItem') idDocItem,
  ): Promise<DocItem> {
    return this.docService.getOneDocItem(+idDoc, +idDocItem);
  }
}
