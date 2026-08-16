import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async findAll(publicOnly = false): Promise<Teacher[]> {
    const where = publicOnly ? { isPublicVisible: true } : {};
    return this.teacherRepository.find({
      where,
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({ where: { id } });
    if (!teacher) throw new Error('Teacher not found');
    return teacher;
  }

  async create(data: Partial<Teacher>): Promise<Teacher> {
    const newTeacher = this.teacherRepository.create(data);
    return this.teacherRepository.save(newTeacher);
  }

  async update(id: string, data: Partial<Teacher>): Promise<Teacher> {
    const teacher = await this.findOne(id);
    Object.assign(teacher, data);
    return this.teacherRepository.save(teacher);
  }

  async remove(id: string): Promise<void> {
    const teacher = await this.findOne(id);
    await this.teacherRepository.remove(teacher);
  }
}
