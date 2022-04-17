import { Module } from '@nestjs/common';
import { ThirdPartyModule } from 'src/third-party/third-party.module';
import { FileController } from './file.controller';

@Module({
  imports: [ThirdPartyModule],
  controllers: [FileController],
  providers: [],
})
export class FileModule {}
