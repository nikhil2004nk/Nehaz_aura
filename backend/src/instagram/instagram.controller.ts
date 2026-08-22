import { Controller, Get, Post, Body, Res, Query, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { InstagramService } from './instagram.service';
import type { Response } from 'express';
import * as https from 'https';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramService) {}

  @Get('posts')
  async getPosts(@Query('username') username?: string) {
    return this.instagramService.getPosts(username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('posts/:id')
  async updatePost(@Param('id') id: string, @Body() updateData: any) {
    await this.instagramService.updatePost(id, updateData);
    return { success: true, message: 'Post updated' };
  }

  // Endpoint to manually trigger the sync (protected for admin only)
  @UseGuards(JwtAuthGuard)
  @Post('sync')
  async triggerSync(@Body('username') username: string) {
    // Run it asynchronously so the request doesn't timeout
    this.instagramService.syncInstagramPosts(username || 'nehaz_aaura');
    return { message: 'Sync started in the background.' };
  }

  @Get('profile')
  async getProfile(@Query('username') username?: string) {
    return this.instagramService.getProfile(username);
  }

  @Get('profiles')
  async getAllProfiles() {
    return this.instagramService.getAllProfiles();
  }

  @Get('public-profiles')
  async getPublicProfiles() {
    return this.instagramService.getPublicProfiles();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/:username/visibility')
  async toggleVisibility(@Param('username') username: string, @Body('isVisible') isVisible: boolean) {
    await this.instagramService.toggleProfileVisibility(username, isVisible);
    return { success: true, message: 'Profile visibility updated' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Body() updateData: any) {
    await this.instagramService.updateProfile('nehaz_aaura', updateData);
    return { success: true, message: 'Profile updated' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('sync-profile')
  async triggerProfileSync(@Body('username') username: string) {
    this.instagramService.syncInstagramProfile(username || 'nehaz_aaura');
    return { message: 'Profile sync started in the background.' };
  }

  // Proxy endpoint to bypass Instagram CDN hotlinking protections
  @Get('image')
  proxyImage(@Query('url') url: string, @Res() res: Response) {
    if (!url || url === 'null' || url === 'undefined') {
      return res.status(400).send('URL is required');
    }
    
    try {
      https.get(url, (imageRes) => {
        // Forward the status code
        if (imageRes.statusCode) {
          res.status(imageRes.statusCode);
        }
        // Forward the content type and cache headers
        if (imageRes.headers['content-type']) {
          res.set('Content-Type', imageRes.headers['content-type']);
        }
        res.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
        imageRes.pipe(res);
      }).on('error', (e) => {
        console.error("Proxy error for URL:", url, e.message);
        res.status(500).send('Failed to fetch image');
      });
    } catch (e) {
      console.error("Invalid URL passed to proxy:", url);
      res.status(400).send('Invalid URL format');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile/:username')
  async deleteProfile(@Param('username') username: string) {
    await this.instagramService.deleteProfile(username);
    return { success: true, message: 'Profile deleted successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('posts/:id')
  async deletePost(@Param('id') id: string) {
    await this.instagramService.deletePost(id);
    return { success: true, message: 'Post deleted successfully' };
  }
}
