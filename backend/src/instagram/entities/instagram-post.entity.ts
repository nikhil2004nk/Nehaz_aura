import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('instagram_posts')
export class InstagramPost {
  @PrimaryColumn()
  id: string; // The Instagram Post ID

  @Column()
  url: string; // The direct link to the post

  @Column({ nullable: true })
  type: string; // Image, Video, or Sidecar

  @Column({ type: 'text', nullable: true })
  caption: string;

  @Column({ type: 'text', nullable: true })
  displayUrl: string; // The thumbnail/image URL

  @Column({ type: 'text', nullable: true })
  videoUrl: string; // Only if type === 'Video'

  @Column({ type: 'timestamp', nullable: true })
  timestamp: Date; // The time the post was published

  @Column({ type: 'int', default: 0 })
  likesCount: number;

  @Column({ type: 'int', default: 0 })
  commentsCount: number;

  @Column({ type: 'int', default: 0 })
  viewsCount: number;

  @Column({ type: 'boolean', default: false })
  isHidden: boolean;

  @Column({ type: 'boolean', default: false })
  isManuallyEdited: boolean;

  @Column({ default: 'nehaz_aaura' })
  ownerUsername: string; // The profile that owns this post

  @CreateDateColumn()
  createdAt: Date; // When we saved it to our DB

  @UpdateDateColumn()
  updatedAt: Date; // When we last synced it
}
