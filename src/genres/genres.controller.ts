import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GenresService } from './genres.service';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateGenreDto } from './dto/create-genre.dto';

@ApiTags('genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new genre' })
  @ApiResponse({
    status: 201,
    description: 'The genre has been successfully created.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() dto: CreateGenreDto) {
    return this.genresService.create(dto.name);
  }

  @Get(':genre')
  @ApiOperation({ summary: 'Find games by genre' })
  @ApiParam({ name: 'genre', description: 'Genre to search for' })
  @ApiResponse({
    status: 200,
    description: 'Returns the games for the specified genre.',
  })
  @ApiResponse({ status: 404, description: 'Genre not found.' })
  async findByGenre(@Param('genre') genre: string) {
    return this.genresService.findByGenre(genre);
  }

  @Get()
  @ApiOperation({ summary: 'Search genres' })
  @ApiResponse({
    status: 200,
    description: 'Returns genres matching the search query.',
  })
  async search(@Query('q') query: string) {
    return this.genresService.search(query);
  }
}
