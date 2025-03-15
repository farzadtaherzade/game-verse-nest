import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from '../entities/genre.entity';
import { Like, Repository } from 'typeorm';
import { Game } from 'src/entities/game.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
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

  async findByGenre(name: string) {
    const genre = await this.genreRepository.findOne({
      where: {
        name,
      },
    });

    if (!genre) throw new BadRequestException('genre name is not defind');

    return await this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.genres', 'genre')
      .where('genre.name = :name', { name: name })
      .getManyAndCount();
  }

  async search(name: string) {
    return await this.genreRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
    });
  }
}
