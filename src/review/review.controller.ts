import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createReviewDto: CreateReviewDto, @GetUser() user: User) {
    return this.reviewService.create(createReviewDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews for a game' })
  @ApiQuery({ name: 'gameId', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Returns all reviews for a game.' })
  findAll(@Query('gameId') gameId: number) {
    return this.reviewService.findAll(gameId);
  }

  @Get('my-reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reviews by the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns all reviews by the user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findMyReviews(@GetUser() user: User) {
    return this.reviewService.findMyReviews(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific review by ID' })
  @ApiResponse({ status: 200, description: 'Returns the review.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get all reviews by a specific user' })
  @ApiResponse({ status: 200, description: 'Returns all reviews by the user.' })
  findUserReviews(@Param('id') id: string) {
    return this.reviewService.findUserReviews(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({ status: 200, description: 'Review successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @GetUser() user: User,
  ) {
    return this.reviewService.update(+id, updateReviewDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({ status: 200, description: 'Review successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.reviewService.remove(+id, user);
  }
}
