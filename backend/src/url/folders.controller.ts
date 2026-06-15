import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('api/folders')
@UseGuards(AuthGuard)
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  async createFolder(@CurrentUser() user: { id: string }, @Body('name') name: string) {
    const result = await this.foldersService.createFolder(user.id, name);
    return {
      success: true,
      message: 'Folder created successfully',
      data: result,
    };
  }

  @Get()
  async listFolders(@CurrentUser() user: { id: string }) {
    const result = await this.foldersService.listFolders(user.id);
    return {
      success: true,
      data: result,
    };
  }

  @Delete(':id')
  async deleteFolder(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    const result = await this.foldersService.deleteFolder(user.id, id);
    return {
      success: true,
      message: 'Folder deleted successfully',
      data: result,
    };
  }
}
