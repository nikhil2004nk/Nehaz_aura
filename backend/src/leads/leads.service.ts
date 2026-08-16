import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, Like, FindOptionsWhere } from 'typeorm';
import { Lead, LeadStatus, LeadLog } from './entities/lead.entity';
import * as crypto from 'crypto';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    @InjectRepository(Lead)
    private leadsRepository: Repository<Lead>,
  ) {}

  async createLead(leadData: Partial<Lead>): Promise<Lead> {
    this.logger.log(`Creating new lead for ${leadData.name}`);
    
    // Explicitly generate exact IST time
    const istTimeString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    leadData.createdAt = new Date(istTimeString);
    leadData.status = LeadStatus.NEW;
    leadData.logs = [];
    
    const lead = this.leadsRepository.create(leadData);
    return await this.leadsRepository.save(lead);
  }

  async updateLead(id: string, updateData: { status?: LeadStatus }): Promise<Lead> {
    const lead = await this.leadsRepository.findOne({ where: { id } });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    if (updateData.status) {
      const istTimeString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const logEntry: LeadLog = {
        id: crypto.randomUUID(),
        message: `Status changed from "${lead.status}" to "${updateData.status}"`,
        type: 'status_change',
        createdAt: new Date(istTimeString).toISOString(),
      };
      lead.logs = [...(lead.logs || []), logEntry];
      lead.status = updateData.status;
    }

    return await this.leadsRepository.save(lead);
  }

  async addLog(id: string, logData: { message: string; type: LeadLog['type'] }): Promise<Lead> {
    const lead = await this.leadsRepository.findOne({ where: { id } });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    const istTimeString = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const logEntry: LeadLog = {
      id: crypto.randomUUID(),
      message: logData.message,
      type: logData.type,
      createdAt: new Date(istTimeString).toISOString(),
    };

    lead.logs = [...(lead.logs || []), logEntry];
    return await this.leadsRepository.save(lead);
  }

  async getStats() {
    const qb = this.leadsRepository.createQueryBuilder('lead');
    const totalCount = await qb.getCount();
    
    // Group by status
    const statusCountsRaw = await qb
      .select('lead.status', 'status')
      .addSelect('COUNT(lead.id)', 'count')
      .groupBy('lead.status')
      .getRawMany();

    const statusCounts = statusCountsRaw.reduce((acc, curr) => {
      acc[curr.status] = parseInt(curr.count, 10);
      return acc;
    }, {} as Record<string, number>);

    return {
      total: totalCount,
      byStatus: statusCounts,
    };
  }

  async findAll(
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
  ) {
    const where: FindOptionsWhere<Lead>[] | FindOptionsWhere<Lead> = {};

    // Build base conditions
    const baseConditions: any = {};

    if (startDate && endDate) {
      baseConditions.createdAt = Between(new Date(Number(startDate)), new Date(Number(endDate)));
    } else if (startDate) {
      baseConditions.createdAt = MoreThanOrEqual(new Date(Number(startDate)));
    } else if (endDate) {
      baseConditions.createdAt = LessThanOrEqual(new Date(Number(endDate)));
    }

    if (status) {
      baseConditions.status = status as LeadStatus;
    }

    const skip = (page - 1) * limit;

    // If search is provided, search across name, phone, and country
    let whereClause: FindOptionsWhere<Lead>[] | FindOptionsWhere<Lead>;

    if (search) {
      whereClause = [
        { ...baseConditions, name: Like(`%${search}%`) },
        { ...baseConditions, phone: Like(`%${search}%`) },
        { ...baseConditions, country: Like(`%${search}%`) },
      ];
    } else {
      whereClause = baseConditions;
    }

    const [data, total] = await this.leadsRepository.findAndCount({
      where: whereClause,
      order: {
        createdAt: 'DESC'
      },
      skip,
      take: limit
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}
