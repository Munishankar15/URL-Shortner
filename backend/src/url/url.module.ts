import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { ApiKeyService } from './apikey.service';
import { ApiKeyController } from './apikey.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UrlController, FoldersController, ApiKeyController],
  providers: [UrlService, FoldersService, ApiKeyService],
  exports: [UrlService, FoldersService, ApiKeyService],
})
export class UrlModule {}
