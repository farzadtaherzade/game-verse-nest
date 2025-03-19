import { FileService } from '../shared/utils/file.service';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { User } from '../entities/user.entity';
import { Game } from '../entities/game.entity';
import { GenresService } from '../genres/genres.service';
import { Platform } from 'src/entities/platform.entity';
import { Company } from 'src/entities/company.entity';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(Platform)
    private readonly platformRepository: Repository<Platform>,
    private readonly genreService: GenresService,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly fileService: FileService,
  ) {}

  async create(
    createGameDto: CreateGameDto,
    user: User,
    file: Express.Multer.File,
  ): Promise<Game> {
    const {
      cover: coverImage,
      description,
      genres: genresIds,
      platforms,
      release_date,
      score,
      slug: gameSlug,
      title,
    } = createGameDto;
    let cover = coverImage;
    let slug = gameSlug;
    slug = slugify(createGameDto.slug || createGameDto.title, {
      lower: true,
      trim: true,
      replacement: '-',
    });

    const existingGame = await this.gameRepository.existsBy({ slug });
    if (existingGame) {
      throw new BadRequestException('A game with this slug already exists');
    }

    const company = await this.companyRepository.findOne({
      where: {
        id: createGameDto.companyId,
      },
    });

    if (!company) throw new BadRequestException('Company not found');

    const genres = await this.genreService.findOrCreate(genresIds);
    cover = file.filename;

    const game = this.gameRepository.create({
      cover,
      description,
      score,
      title,
      slug,
      user,
      genres,
      release_date,
      platforms: [],
      company,
    });

    for (const id of platforms) {
      const platform = await this.platformRepository.findOne({
        where: {
          id,
        },
      });
      if (platform) {
        game.platforms.push(platform);
      }
    }

    return await this.gameRepository.save(game);
  }

  async findAll(paginate: PaginationDto) {
    const { limit = 10, page = 1 } = paginate;
    const [games, count] = await this.gameRepository.findAndCount({
      relations: {
        genres: true,
        user: true,
        platforms: true,
      },
      take: limit,
      skip: limit * (page - 1),
    });

    return {
      data: games,
      meta: {
        totalItems: count,
        limit,
        page,
      },
    };
  }

  async findOne(id: number): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: {
        user: true,
        genres: true,
      },
    });
    if (!game) {
      throw new NotFoundException(`Game not found with ID ${id}`);
    }
    return game;
  }

  async update(
    id: number,
    updateGameDto: UpdateGameDto,
    user: User,
  ): Promise<Game> {
    const game = await this.findOne(id);
    console.log(user);
    if (game.user.id != user.id)
      throw new UnauthorizedException(
        `You not Allowd update game ${game.title} -- ${game.id}`,
      );
    const { genres: genreNames, ...dto } = updateGameDto;

    const updatedGame = this.gameRepository.merge(game, {
      ...dto,
      platforms: [],
    });

    if (genreNames)
      updatedGame.genres = await this.genreService.findOrCreate(genreNames);

    if (updateGameDto.title) {
      updatedGame.slug = slugify(updateGameDto.title, {
        lower: true,
        trim: true,
        replacement: '-',
      });
    }

    return await this.gameRepository.save(updatedGame);
  }

  async remove(id: number, user: User): Promise<{ message: string }> {
    const game = await this.findOne(id);
    this.fileService.deleteFile(game.cover, 'games');
    if (game.user.id != user.id)
      throw new UnauthorizedException(
        `You not Allowd delete game ${game.title} -- ${game.id}`,
      );
    await this.gameRepository.remove(game);
    return { message: 'Game deleted successfully' };
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const slug = slugify(title, { lower: true, trim: true, replacement: '-' });
    let counter = 1;
    let uniqueSlug = slug;

    while (await this.gameRepository.findOneBy({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter++}`;
    }

    return uniqueSlug;
  }
}
