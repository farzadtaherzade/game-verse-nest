import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from '../entities/genre.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async findOrCreate(names: string[]): Promise<Genre[]> {
    const genres: Genre[] = [];

    for (const name of names) {
      const genre = await this.genreRepository.findOneBy({
        name,
      });
      if (genre) genres.push(genre);
      else {
        genres.push(await this.create(name));
      }
    }
    return genres;
  }

  async create(genreName: string): Promise<Genre> {
    const genre = this.genreRepository.create({ name: genreName });
    return await this.genreRepository.save(genre);
  }
}
