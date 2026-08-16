import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column('text')
  bio: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  instagramUrl: string;

  @Column({ default: 0 })
  order: number;

  @Column({ default: true })
  isPublicVisible: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
