import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstagramController } from './instagram.controller';
import { InstagramService } from './instagram.service';
import { InstagramPost } from './entities/instagram-post.entity';
import { InstagramProfile } from './entities/instagram-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InstagramPost, InstagramProfile])],
  controllers: [InstagramController],
  providers: [InstagramService],
  exports: [InstagramService],
})
export class InstagramModule {}
