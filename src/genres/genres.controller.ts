import { Controller, Get, Param } from '@nestjs/common';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get(':genre')
  async findByGenre(@Param('genre') genre: string) {
    return this.genresService.findByGenre(genre);
  }
}
