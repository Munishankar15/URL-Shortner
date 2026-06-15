import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiKeyService } from './apikey.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('api/keys')
@UseGuards(AuthGuard)
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  async createKey(@CurrentUser() user: { id: string }, @Body('name') name: string) {
    const result = await this.apiKeyService.createApiKey(user.id, name);
    return {
      success: true,
      message: 'API Key generated successfully. Keep it safe!',
      data: result,
    };
  }

  @Get()
  async listKeys(@CurrentUser() user: { id: string }) {
    const result = await this.apiKeyService.listApiKeys(user.id);
    return {
      success: true,
      data: result,
    };
  }

  @Delete(':id')
  async deleteKey(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    const result = await this.apiKeyService.deleteApiKey(user.id, id);
    return {
      success: true,
      message: 'API Key deleted successfully',
      data: result,
    };
  }
}
