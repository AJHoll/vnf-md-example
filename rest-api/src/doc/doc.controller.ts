import { Controller, Get, Param } from '@nestjs/common';
import { DocService } from './doc.service';

@Controller('doc')
export class DocController {
  constructor(private readonly docService: DocService) {}

  @Get('/')
  async getAllDoc(): Promise<any | any[]> {
    return this.docService.getAllDoc();
  }

  @Get('/:id')
  async getOneDoc(@Param('id') id): Promise<any> {
    return this.docService.getOneDoc(+id);
  }
}
