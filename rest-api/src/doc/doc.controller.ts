import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Doc, DocItem, DocService } from './doc.service';
import { CreateDocItemDto } from './dto/create-doc-item.dto';
import { CreateDocDto } from './dto/create-doc.dto';
import { UpdateDocItemDto } from './dto/update-doc-item.dto';
import { UpdateDocDto } from './dto/update-doc.dto';

@Controller('doc')
export class DocController {
  constructor(private readonly docService: DocService) {}

  // DOC
  @Get('/')
  async getAllDoc(): Promise<Doc | Doc[]> {
    return this.docService.getAllDoc();
  }

  @Get('/:idDoc')
  async getOneDoc(@Param('idDoc') idDoc): Promise<Doc> {
    return this.docService.getOneDoc(+idDoc);
  }

  @Post('/')
  async createDoc(@Body() createDocDto: CreateDocDto): Promise<void> {
    return this.docService.createDoc(createDocDto);
  }

  @Patch('/')
  async updateDoc(@Body() UpdateDocDto: UpdateDocDto): Promise<void> {
    return this.docService.updateDoc(UpdateDocDto);
  }

  @Delete('/:idDoc')
  async deleteDoc(@Param('idDoc') idDoc): Promise<void> {
    return this.docService.deleteDoc(+idDoc);
  }

  //DOC_ITEM
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

  @Post('/:idDoc/item')
  async createDocItem(
    @Param('idDoc') idDoc: number,
    @Body() createDocItemDto: CreateDocItemDto,
  ): Promise<void> {
    createDocItemDto.doc = idDoc;
    return this.docService.createDocItem(createDocItemDto);
  }

  @Patch('/:idDoc/item/:idDocItem')
  async updateDocItem(
    @Param('idDoc') idDoc: number,
    @Param('idDocItem') idDocItem: number,
    @Body() updateDocItemDto: UpdateDocItemDto,
  ): Promise<void> {
    updateDocItemDto.doc = idDoc;
    updateDocItemDto.id = idDocItem;
    return this.docService.updateDocItem(updateDocItemDto);
  }
}
