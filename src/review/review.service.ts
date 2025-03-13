import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { GamesService } from 'src/games/games.service';
import { Rate } from 'src/entities/rate.entity';
import { PlatformService } from 'src/platform/platform.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Rate)
    private readonly rateRepository: Repository<Rate>,
    private readonly gameService: GamesService,
    private readonly platformService: PlatformService,
  ) {}

  async create(createReviewDto: CreateReviewDto, user: User) {
    const game = await this.gameService.findOne(createReviewDto.gameId);
    const platform = await this.platformService.findOne(
      createReviewDto.platformId,
    );
    const review = this.reviewRepository.create({
      ...createReviewDto,
      user,
      game,
      platform,
    });
    const rate = this.rateRepository.create({
      game,
      user,
      score: createReviewDto.score,
    });

    review.rate = rate;

    return await this.reviewRepository.save(review);
  }

  async findAll(gameId?: number) {
    const option: FindManyOptions<Review> = {
      where: {},
      relations: {
        user: true,
        platform: true,
        game: true,
        rate: true,
      },
    };
    if (gameId)
      option.where = {
        game: {
          id: gameId,
        },
      };

    const reviews = await this.reviewRepository.find(option);
    return reviews;
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
        platform: true,
        game: true,
        rate: true,
      },
    });
    if (!review) throw new NotFoundException('review not found  id is invalid');
    review.view++;
    await this.reviewRepository.save(review);
    return review;
  }

  async update(id: number, { content, score }: UpdateReviewDto, user: User) {
    if (!content && !score) throw new BadRequestException('nothing to update');

    const review = await this.findOne(id);
    if (review.user.id !== user.id)
      throw new ConflictException('You can only update your own reviews');
    if (content) {
      review.content = content;
    }

    if (score) {
      review.rate.score = score;
    }

    return await this.reviewRepository.save(review);
  }

  async remove(id: number, user: User) {
    const review = await this.findOne(id);

    if (!review) throw new NotFoundException('review not found');

    if (review.user.id !== user.id)
      throw new ConflictException('You can only delete your own reviews');

    await this.reviewRepository.remove(review);

    return {
      status: HttpStatus.OK,
      message: 'review deleted successfully',
      review,
    };
  }
}
