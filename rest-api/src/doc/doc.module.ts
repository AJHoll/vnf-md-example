import { Module } from '@nestjs/common';
import { DocController } from './doc.controller';
import { DocService } from './doc.service';
@Module({
  controllers: [DocController],
  providers: [DocService],
})
export class DocModule {}
