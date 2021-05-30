import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DocModule } from './doc/doc.module';

@Module({
  imports: [DocModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
