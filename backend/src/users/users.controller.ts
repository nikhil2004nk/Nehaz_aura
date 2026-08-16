import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Req() req: Request) {
    // req.user is populated by JwtStrategy
    return req.user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    // In a real app, use DTOs and restrict who can update (admin or the user themselves)
    return this.usersService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // In a real app, restrict to Admin
    return this.usersService.remove(id);
  }
}
