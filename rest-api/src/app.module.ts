import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocController } from './doc/doc.controller';
import { DocService } from './doc/doc.service';

@Module({
  imports: [],
  controllers: [AppController, DocController],
  providers: [AppService, DocService],
})
export class AppModule {}
