import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  FOLLOW_UP = 'follow_up',
  INTERESTED = 'interested',
  CONVERTED = 'converted',
  NOT_INTERESTED = 'not_interested',
  LOST = 'lost',
}

export interface LeadLog {
  id: string;
  message: string;
  type: 'call' | 'message' | 'email' | 'note' | 'status_change';
  createdAt: string;
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  age: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  time: string;

  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @Column({ type: 'json', nullable: true, default: null })
  logs: LeadLog[] | null;

  @Column({ type: 'timestamp' })
  createdAt: Date;
}
