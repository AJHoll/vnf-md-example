import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DocService, SuccessData, ErrorData } from './doc.service';
import { CreateDocItemDto } from './dto/create-doc-item.dto';
import { CreateDocDto } from './dto/create-doc.dto';
import { UpdateDocItemDto } from './dto/update-doc-item.dto';
import { UpdateDocDto } from './dto/update-doc.dto';

@Controller('api/doc')
export class DocController {
  constructor(private readonly docService: DocService) {}

  // DOC
  @Get('/')
  async getAllDoc(): Promise<SuccessData | ErrorData> {
    return this.docService.getAllDoc();
  }

  @Get('/:idDoc')
  async getOneDoc(@Param('idDoc') idDoc): Promise<SuccessData | ErrorData> {
    return this.docService.getOneDoc(+idDoc);
  }

  @Post('/')
  async createDoc(
    @Body() createDocDto: CreateDocDto,
  ): Promise<SuccessData | ErrorData> {
    return this.docService.createDoc(createDocDto);
  }

  @Patch('/:idDoc')
  async updateDoc(
    @Param('idDoc') idDoc: number,
    @Body() updateDocDto: UpdateDocDto,
  ): Promise<SuccessData | ErrorData> {
    updateDocDto.id = idDoc;
    return this.docService.updateDoc(updateDocDto);
  }

  @Delete('/:idDoc')
  async deleteDoc(@Param('idDoc') idDoc): Promise<SuccessData | ErrorData> {
    return this.docService.deleteDoc(+idDoc);
  }

  //DOC_ITEM
  @Get('/:idDoc/item')
  async getAllDocItem(@Param('idDoc') idDoc): Promise<SuccessData | ErrorData> {
    return this.docService.getAllDocItem(+idDoc);
  }

  @Get('/:idDoc/item/:idDocItem')
  async getOneDocItem(
    @Param('idDoc') idDoc,
    @Param('idDocItem') idDocItem,
  ): Promise<SuccessData | ErrorData> {
    return this.docService.getOneDocItem(+idDoc, +idDocItem);
  }

  @Post('/:idDoc/item')
  async createDocItem(
    @Param('idDoc') idDoc: number,
    @Body() createDocItemDto: CreateDocItemDto,
  ): Promise<SuccessData | ErrorData> {
    createDocItemDto.doc = idDoc;
    return this.docService.createDocItem(createDocItemDto);
  }

  @Patch('/:idDoc/item/:idDocItem')
  async updateDocItem(
    @Param('idDoc') idDoc: number,
    @Param('idDocItem') idDocItem: number,
    @Body() updateDocItemDto: UpdateDocItemDto,
  ): Promise<SuccessData | ErrorData> {
    updateDocItemDto.doc = idDoc;
    updateDocItemDto.id = idDocItem;
    return this.docService.updateDocItem(updateDocItemDto);
  }

  @Delete('/:idDoc/item/:idDocItem')
  async deleteDocItem(
    @Param('idDoc') idDoc: number,
    @Param('idDocItem') idDocItem: number,
  ): Promise<SuccessData | ErrorData> {
    return this.docService.deleteDocItem(idDocItem, idDoc);
  }
}
