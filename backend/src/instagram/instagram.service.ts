import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApifyClient } from 'apify-client';
import { InstagramPost } from './entities/instagram-post.entity';
import { InstagramProfile } from './entities/instagram-profile.entity';

@Injectable()
export class InstagramService implements OnModuleInit {
  private readonly logger = new Logger(InstagramService.name);
  private apifyClient: ApifyClient;

  constructor(
    private configService: ConfigService,
    @InjectRepository(InstagramPost)
    private instagramPostRepository: Repository<InstagramPost>,
    @InjectRepository(InstagramProfile)
    private instagramProfileRepository: Repository<InstagramProfile>,
  ) { }

  async onModuleInit() {
    const token = this.configService.get<string>('APIFY_API_TOKEN');
    if (!token) {
      this.logger.warn('APIFY_API_TOKEN is missing from environment variables.');
    } else {
      this.apifyClient = new ApifyClient({ token });

      // Auto-sync posts on startup ONLY if the database is completely empty
      try {
        const count = await this.instagramPostRepository.count();
        if (count === 0) {
          this.logger.log('Database is empty. Automatically triggering initial Apify sync...');
          this.syncInstagramPosts().catch(err => console.error(err));
        }
        const profileCount = await this.instagramProfileRepository.count();
        if (profileCount === 0) {
          this.logger.log('Profile database is empty. Automatically triggering profile sync...');
          this.syncInstagramProfile().catch(err => console.error(err));
        }
      } catch (err) {
        this.logger.error('Failed to check database count on startup', err);
      }
    }
  }

  /**
   * Endpoint for frontend to fetch cached posts from database.
   * Returns top 5 most viewed posts, followed by the latest 5 posts for a specific user.
   */
  async getPosts(username: string = 'nehaz_aaura'): Promise<InstagramPost[]> {
    // 1. Get the top 5 most viewed posts
    const topViewed = await this.instagramPostRepository.find({
      where: { isHidden: false, ownerUsername: username },
      order: { viewsCount: 'DESC' },
      take: 5,
    });

    const topIds = topViewed.map((post) => post.id);

    // 2. Get the latest 5 posts that are NOT already in the top 5
    const latest = await this.instagramPostRepository.find({
      where: topIds.length > 0 ? { id: Not(In(topIds)), isHidden: false, ownerUsername: username } : { isHidden: false, ownerUsername: username },
      order: { id: 'DESC' }, // Chronological order
      take: 5,
    });

    // 3. Combine them: Top 5 viewed first, followed by 5 latest
    return [...topViewed, ...latest];
  }

  /**
   * Cron job that runs at midnight every day to fetch the latest Instagram posts
   * and cache them in the MySQL database.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncInstagramPosts(username: string = "nehaz_aaura") {
    if (!this.apifyClient) {
      this.logger.error('Apify client not initialized. Sync aborted.');
      return;
    }

    this.logger.log('Starting daily sync of Instagram posts via Apify...');

    try {
      const input = {
        maxRecords: 10,
        usernames: [username],
        resultsType: "posts",
        postsLimit: 10,
        includeRelatedProfiles: false,
        mediaType: "any",
        withAiSentiment: false,
        withAiTopics: false,
      };

      // Run the actor
      const run = await this.apifyClient.actor("QE0yktj74B94JgcFw").call(input);

      // Fetch results
      this.logger.log(`Apify run finished. Fetching dataset: ${run.defaultDatasetId}`);
      const { items } = await this.apifyClient.dataset(run.defaultDatasetId).listItems();

      // If we successfully fetched fresh posts, delete the old non-edited ones first
      if (items && items.length > 0) {
        await this.instagramPostRepository.delete({ ownerUsername: username, isManuallyEdited: false });
        this.logger.log(`Cleared old non-edited posts for ${username} to prepare for fresh sync.`);
      }

      let savedCount = 0;
      for (const item of items) {
        // Skip items that don't have required data
        if (!item.id || !item.url) continue;

        let resolvedDisplayUrl = item.displayUrl as string;
        if (!resolvedDisplayUrl && item.imageUrl) {
          resolvedDisplayUrl = item.imageUrl as string;
        }
        if (!resolvedDisplayUrl && item.images && Array.isArray(item.images) && item.images.length > 0) {
          resolvedDisplayUrl = item.images[0];
        }
        if (!resolvedDisplayUrl && item.childPosts && Array.isArray(item.childPosts) && item.childPosts.length > 0) {
          resolvedDisplayUrl = item.childPosts[0].displayUrl || (item.childPosts[0].images && item.childPosts[0].images[0]);
        }
        if (!resolvedDisplayUrl && item.thumbnailUrl) {
          resolvedDisplayUrl = item.thumbnailUrl as string;
        }

        const postData = {
          id: item.id as string,
          url: item.url as string,
          type: item.type as string || 'Image',
          caption: item.caption as string || '',
          displayUrl: resolvedDisplayUrl || '',
          videoUrl: item.videoUrl as string,
          timestamp: item.timestamp ? new Date(item.timestamp as string) : (item.takenAt ? new Date(item.takenAt as string) : new Date()),
          likesCount: (item.likesCount as number) || 0,
          commentsCount: (item.commentsCount as number) || 0,
          viewsCount: (item.videoViewCount as number) || (item.viewCount as number) || (item.playCount as number) || 0,
          ownerUsername: username,
        };

        // Check if post exists and is manually edited
        const existingPost = await this.instagramPostRepository.findOne({ where: { id: postData.id } });
        if (existingPost && existingPost.isManuallyEdited) {
          continue; // Skip overwriting manually edited post
        }

        // Save or update the post in the database
        await this.instagramPostRepository.save(postData);
        savedCount++;
      }

      this.logger.log(`Successfully synced ${savedCount} posts to database.`);
    } catch (error) {
      this.logger.error('Failed to sync Instagram posts', error);
    }
  }

  /**
   * Fetch cached profile from database
   */
  async getProfile(username: string = 'nehaz_aaura'): Promise<InstagramProfile | null> {
    return this.instagramProfileRepository.findOne({
      where: { username },
    });
  }

  /**
   * Fetch all cached profiles
   */
  async getAllProfiles(): Promise<InstagramProfile[]> {
    return this.instagramProfileRepository.find();
  }

  /**
   * Fetch only publicly visible profiles
   */
  async getPublicProfiles(): Promise<InstagramProfile[]> {
    return this.instagramProfileRepository.find({
      where: { isPublicVisible: true },
    });
  }

  /**
   * Cron job that runs at midnight every day to fetch the latest Instagram profile details.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncInstagramProfile(username: string = "nehaz_aaura") {
    if (!this.apifyClient) {
      this.logger.error('Apify client not initialized. Profile sync aborted.');
      return;
    }

    this.logger.log('Starting daily sync of Instagram profile via Apify...');

    try {
      const input = { usernames: [username] };

      // Run the profile actor
      const run = await this.apifyClient.actor("apify/instagram-profile-scraper").call(input);

      // Fetch results
      this.logger.log(`Apify run finished. Fetching dataset: ${run.defaultDatasetId}`);
      const { items } = await this.apifyClient.dataset(run.defaultDatasetId).listItems();

      if (items && items.length > 0) {
        const item = items[0];

        const profileData = {
          username: item.username as string,
          fullName: item.fullName as string,
          profilePicUrl: item.profilePicUrl as string,
          postsCount: (item.postsCount as number) || 0,
          followersCount: (item.followersCount as number) || 0,
          followsCount: (item.followsCount as number) || 0,
          biography: item.biography as string || '',
        };

        // Check if profile is manually edited
        const existingProfile = await this.instagramProfileRepository.findOne({ where: { username: profileData.username } });
        if (!existingProfile || !existingProfile.isManuallyEdited) {
          await this.instagramProfileRepository.save(profileData);
          this.logger.log(`Successfully synced profile for ${profileData.username}`);
        } else {
          this.logger.log(`Skipped syncing profile for ${profileData.username} because it is manually edited.`);
        }
      }
    } catch (error) {
      this.logger.error('Failed to sync Instagram profile', error);
    }
  }

  /**
   * Update post manual edits
   */
  async updatePost(id: string, updateData: Partial<InstagramPost>) {
    const post = await this.instagramPostRepository.findOne({ where: { id } });
    if (!post) throw new Error('Post not found');
    
    Object.assign(post, updateData);
    post.isManuallyEdited = true;
    return this.instagramPostRepository.save(post);
  }

  /**
   * Update profile manual edits
   */
  async updateProfile(username: string, updateData: Partial<InstagramProfile>) {
    let profile = await this.instagramProfileRepository.findOne({ where: { username } });
    if (!profile) {
      profile = this.instagramProfileRepository.create({ username });
    }
    
    Object.assign(profile, updateData);
    profile.isManuallyEdited = true;
    return this.instagramProfileRepository.save(profile);
  }

  /**
   * Toggle public visibility for a profile
   */
  async toggleProfileVisibility(username: string, isVisible: boolean) {
    let profile = await this.instagramProfileRepository.findOne({ where: { username } });
    if (!profile) throw new Error('Profile not found');
    
    profile.isPublicVisible = isVisible;
    return this.instagramProfileRepository.save(profile);
  }
  /**
   * Delete a profile
   */
  async deleteProfile(username: string) {
    const profile = await this.instagramProfileRepository.findOne({ where: { username } });
    if (!profile) throw new Error('Profile not found');
    
    // Also delete all posts associated with this profile
    await this.instagramPostRepository.delete({ ownerUsername: username });
    
    return this.instagramProfileRepository.remove(profile);
  }

  /**
   * Delete a post
   */
  async deletePost(id: string) {
    const post = await this.instagramPostRepository.findOne({ where: { id } });
    if (!post) throw new Error('Post not found');
    
    return this.instagramPostRepository.remove(post);
  }
}
