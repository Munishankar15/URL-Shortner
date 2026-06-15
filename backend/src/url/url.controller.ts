import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Res, Headers } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import * as express from 'express';

@Controller()
export class UrlController {
  private readonly frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  constructor(private readonly urlService: UrlService) {}

  @Post('api/urls')
  @UseGuards(AuthGuard)
  async createUrl(@CurrentUser() user: { id: string }, @Body() dto: CreateUrlDto) {
    const result = await this.urlService.createUrl(user.id, dto);
    return {
      success: true,
      message: 'URL shortened successfully',
      data: result,
    };
  }

  @Get('api/urls')
  @UseGuards(AuthGuard)
  async listUrls(
    @CurrentUser() user: { id: string }, 
    @Query('search') search?: string,
    @Query('folderId') folderId?: string,
    @Query('tag') tag?: string,
  ) {
    const result = await this.urlService.listUrls(user.id, search, folderId, tag);
    return {
      success: true,
      data: result,
    };
  }

  @Get('api/urls/check-alias')
  @UseGuards(AuthGuard)
  async checkAlias(@Query('alias') alias: string) {
    const available = await this.urlService.checkAliasAvailability(alias);
    return {
      success: true,
      available,
    };
  }

  @Delete('api/urls/:id')
  @UseGuards(AuthGuard)
  async deleteUrl(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    const result = await this.urlService.deleteUrl(user.id, id);
    return {
      success: true,
      message: 'URL deleted successfully',
      data: result,
    };
  }

  @Post('api/urls/:shortCode/verify')
  async verifyPassword(
    @Param('shortCode') shortCode: string,
    @Body('password') passwordInput: string,
    @Headers('user-agent') userAgent: string | undefined,
    @Headers('referer') referer: string | undefined,
  ) {
    const originalUrl = await this.urlService.verifyPasswordAndRedirect(shortCode, passwordInput, userAgent, referer);
    return {
      success: true,
      originalUrl,
    };
  }

  @Post('api/urls/bulk')
  @UseGuards(AuthGuard)
  async bulkShorten(
    @CurrentUser() user: { id: string },
    @Body('csvText') csvText: string,
    @Body('folderId') folderId?: string,
    @Body('tags') tags?: string[],
  ) {
    const csvResult = await this.urlService.bulkShorten(user.id, csvText, folderId, tags);
    return {
      success: true,
      csv: csvResult,
    };
  }

  // Public Redirection Endpoint
  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Headers('user-agent') userAgent: string | undefined,
    @Headers('referer') referer: string | undefined,
    @Res() res: express.Response,
  ) {
    const state = await this.urlService.getRedirectState(shortCode);

    if (state.status === 'not_found') {
      return res.redirect(302, `${this.frontendUrl}/error?type=not_found`);
    }

    if (state.status === 'expired') {
      return res.redirect(302, `${this.frontendUrl}/error?type=expired`);
    }

    if (state.status === 'limit_reached') {
      return res.redirect(302, `${this.frontendUrl}/error?type=limit_reached`);
    }

    if (state.status === 'password_protected') {
      return res.redirect(302, `${this.frontendUrl}/p/${shortCode}`);
    }

    const { urlRecord } = state;

    if (!urlRecord) {
      return res.redirect(302, `${this.frontendUrl}/error?type=not_found`);
    }

    // Custom OG Preview metadata rendering
    const hasOgMetadata = urlRecord.ogTitle || urlRecord.ogDescription || urlRecord.ogImage;
    if (hasOgMetadata) {
      await this.urlService.recordVisit(urlRecord.id, userAgent, referer);

      res.setHeader('Content-Type', 'text/html');
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>${urlRecord.ogTitle || 'Redirecting...'}</title>
            ${urlRecord.ogTitle ? `<meta property="og:title" content="${urlRecord.ogTitle}" />` : ''}
            ${urlRecord.ogDescription ? `<meta property="og:description" content="${urlRecord.ogDescription}" />` : ''}
            ${urlRecord.ogImage ? `<meta property="og:image" content="${urlRecord.ogImage}" />` : ''}
            <meta property="og:type" content="website" />
            <meta property="og:url" content="${urlRecord.shortUrl}" />
            
            ${urlRecord.ogTitle ? `<meta name="twitter:title" content="${urlRecord.ogTitle}" />` : ''}
            ${urlRecord.ogDescription ? `<meta name="twitter:description" content="${urlRecord.ogDescription}" />` : ''}
            ${urlRecord.ogImage ? `<meta name="twitter:image" content="${urlRecord.ogImage}" />` : ''}
            <meta name="twitter:card" content="summary_large_image" />

            <meta http-equiv="refresh" content="0; url=${urlRecord.originalUrl}" />
            <script>window.location.href = ${JSON.stringify(urlRecord.originalUrl)};</script>
          </head>
          <body>
            Redirecting you to <a href="${urlRecord.originalUrl}">${urlRecord.originalUrl}</a>...
          </body>
        </html>
      `);
    }

    // Standard redirect
    await this.urlService.recordVisit(urlRecord.id, userAgent, referer);
    res.redirect(302, urlRecord.originalUrl);
  }
}
