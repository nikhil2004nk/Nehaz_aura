import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [{ email: userData.email }, { phone: userData.phone }]
    });

    if (existingUser) {
      throw new ConflictException('User with this email or phone already exists');
    }

    const user = this.usersRepository.create(userData);
    return await this.usersRepository.save(user);
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { phone } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    
    // Check for conflicts if updating email or phone
    if (updateData.email || updateData.phone) {
      const existingUser = await this.usersRepository.findOne({
        where: [
          { email: updateData.email },
          { phone: updateData.phone }
        ]
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email or phone already in use by another account');
      }
    }

    Object.assign(user, updateData);
    return await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }
}
