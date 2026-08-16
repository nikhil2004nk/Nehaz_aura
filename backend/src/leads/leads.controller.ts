import { Controller, Post, Body, Get, Query, Patch, Param, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LeadStatus } from './entities/lead.entity';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  async create(@Body() leadData: CreateLeadDto) {
    const lead = await this.leadsService.createLead(leadData);
    return {
      success: true,
      message: 'Lead captured successfully',
      data: lead
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats() {
    const stats = await this.leadsService.getStats();
    return { success: true, data: stats };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.leadsService.findAll(
      startDate,
      endDate,
      parseInt(page, 10),
      parseInt(limit, 10),
      search,
      status,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: LeadStatus
  ) {
    const lead = await this.leadsService.updateLead(id, { status });
    return { success: true, data: lead };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/logs')
  async addLog(
    @Param('id') id: string,
    @Body() logData: { message: string; type: 'call' | 'message' | 'email' | 'note' | 'status_change' }
  ) {
    const lead = await this.leadsService.addLog(id, logData);
    return { success: true, data: lead };
  }
}
