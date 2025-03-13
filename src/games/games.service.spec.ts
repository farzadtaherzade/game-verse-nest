/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { GenresService } from '../genres/genres.service';
import { Repository } from 'typeorm';
import { Game } from '../entities/game.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { User } from '../entities/user.entity';
import { Genre } from '../entities/genre.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('GamesService', () => {
  let service: GamesService;
  let genreService: GenresService;
  let gameRepository: Repository<Game>;

  const GAME_REPOSITORY_TOKEN = getRepositoryToken(Game);

  const mockUser: User = {
    id: 10,
    email: 'mockuser@example.com',
    username: '',
    password: 'password',
    avatar: 'avatar.jpg',
    games: [],
    created_at: new Date(),
  };
  const mockGameEntity: Game = {
    id: 1,
    title: 'Mock Game',
    description: 'A mock game description.',
    score: 90,
    slug: 'mock-game',
    release_date: new Date(),
    cover: 'mock-cover.jpg',
    genres: [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Adventure' },
    ],
    user: mockUser,
    created_at: new Date(),
    updated_at: new Date(),
  };
  const mockGenre: Genre = {
    id: 1,
    name: 'Action',
  };
  const mockListGenres: Genre[] = [mockGenre, { id: 2, name: 'Adventure' }];
  const mockFile = { filename: 'test.jpg' } as Express.Multer.File;

  const mockCreateGameDto: CreateGameDto = {
    title: mockGameEntity.title,
    cover: mockGameEntity.cover,
    description: mockGameEntity.description,
    genres: mockGameEntity.genres.map((genre) => genre.name),
    slug: mockGameEntity.slug,
    release_date: mockGameEntity.release_date,
    score: mockGameEntity.score,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: GAME_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            existsBy: jest.fn(),
          },
        },
        {
          provide: GenresService,
          useValue: {
            findOrCreate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    genreService = module.get<GenresService>(GenresService);
    gameRepository = module.get<Repository<Game>>(GAME_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be game repository defined', () => {
    expect(gameRepository).toBeDefined();
  });

  it('should be genre service defined', () => {
    expect(genreService).toBeDefined();
  });

  describe('create Game', () => {
    it('should create a new game', async () => {
      jest.spyOn(gameRepository, 'existsBy').mockResolvedValue(false);
      jest.spyOn(gameRepository, 'save').mockResolvedValue(mockGameEntity);
      jest.spyOn(gameRepository, 'create').mockReturnValue(mockGameEntity);
      jest
        .spyOn(genreService, 'findOrCreate')
        .mockResolvedValue(mockListGenres);

      await service.create(mockCreateGameDto, mockUser, mockFile);
      expect(gameRepository.existsBy).toHaveBeenCalledWith({
        slug: mockCreateGameDto.slug,
      });
      expect(gameRepository.create).toHaveBeenCalledWith({
        ...mockCreateGameDto,
        user: mockUser,
        genres: mockListGenres,
      });
      expect(gameRepository.save).toHaveBeenCalledWith(mockGameEntity);
    });

    it('should throw error if game slug already exists', async () => {
      jest.spyOn(gameRepository, 'existsBy').mockResolvedValue(true);

      await expect(
        service.create(mockCreateGameDto, mockUser, mockFile),
      ).rejects.toThrow(
        new BadRequestException('A game with this slug already exists'),
      );
    });
  });

  describe('findAll', () => {
    it('should return all of the games', async () => {
      jest.spyOn(gameRepository, 'find').mockResolvedValue([mockGameEntity]);
      const result = await service.findAll();
      expect(result).toEqual([mockGameEntity]);
      expect(gameRepository.find).toHaveBeenCalled();
    });

    it('should return empty list', async () => {
      jest.spyOn(gameRepository, 'find').mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(gameRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return game', async () => {
      jest.spyOn(gameRepository, 'findOne').mockResolvedValue(mockGameEntity);
      const result = await service.findOne(1);
      expect(result).toEqual(mockGameEntity);
      expect(gameRepository.findOne).toHaveBeenCalled();
    });
    it('should return throw 404 not found', async () => {
      jest.spyOn(gameRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(
        new NotFoundException('Game not found with ID 1'),
      );
      expect(gameRepository.findOne).toHaveBeenCalled();
    });
  });
});
