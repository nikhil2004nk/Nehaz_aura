import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { Teacher } from './entities/teacher.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  async findAll(@Query('publicOnly') publicOnly: string) {
    const isPublic = publicOnly === 'true';
    const teachers = await this.teachersService.findAll(isPublic);
    return { data: teachers };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createData: Partial<Teacher>) {
    const teacher = await this.teachersService.create(createData);
    return { data: teacher, message: 'Teacher created successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Teacher>) {
    const teacher = await this.teachersService.update(id, updateData);
    return { data: teacher, message: 'Teacher updated successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.teachersService.remove(id);
    return { message: 'Teacher deleted successfully' };
  }
}
