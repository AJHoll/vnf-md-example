import { Module } from '@nestjs/common';

import { DocModule } from './doc/doc.module';

@Module({
  imports: [DocModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
