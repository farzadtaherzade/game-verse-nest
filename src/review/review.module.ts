import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { GamesModule } from 'src/games/games.module';
import { Rate } from 'src/entities/rate.entity';
import { PlatformModule } from 'src/platform/platform.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Rate]),
    GamesModule,
    PlatformModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
