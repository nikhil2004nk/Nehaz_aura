import { Entity, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('instagram_profiles')
export class InstagramProfile {
  @PrimaryColumn({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  fullName: string;

  @Column({ type: 'text', nullable: true })
  profilePicUrl: string;

  @Column({ type: 'int', default: 0 })
  postsCount: number;

  @Column({ type: 'int', default: 0 })
  followersCount: number;

  @Column({ type: 'int', default: 0 })
  followsCount: number;

  @Column({ type: 'text', nullable: true })
  biography: string;

  @Column({ type: 'boolean', default: false })
  isManuallyEdited: boolean;

  @Column({ type: 'boolean', default: false })
  isPublicVisible: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
