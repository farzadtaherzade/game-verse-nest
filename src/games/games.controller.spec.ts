/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { User } from '../entities/user.entity';
import { Game } from '../entities/game.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';

describe('GamesController', () => {
  let controller: GamesController;
  let service: GamesService;

  const mockGenres = { id: 1, name: 'action' };
  const mockUser = { id: 10 } as User;

  const mockGame: Game = {
    id: 10,
    title: 'stray',
    description: 'a game about cat',
    score: 10,
    slug: 'stray-game',
    release_date: new Date(),
    cover: '',
    user: mockUser,
    genres: [mockGenres],
    updated_at: new Date(),
    created_at: new Date(),
  };

  const mockCreateGameDto: CreateGameDto = {
    title: 'factorio',
    description: 'a game about cat',
    score: 10,
    slug: 'stray-game',
    release_date: new Date(),
    cover: '',
    genres: ['action'],
  };

  const mockGameRepository = {
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  const mockGamesService = {
    create: jest.fn().mockResolvedValue(mockGame),
    findAll: jest.fn().mockResolvedValue([mockGame]),
    findOne: jest.fn().mockResolvedValue(mockGame),
    update: jest.fn().mockResolvedValue(mockGame),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: mockGamesService,
        },
        {
          provide: getRepositoryToken(Game),
          useValue: mockGameRepository,
        },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
    service = module.get<GamesService>(GamesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be service defined', () => {
    expect(service).toBeDefined();
  });

  describe('single game', () => {
    it('should return game', async () => {
      const result = await controller.findOne('7');
      expect(result).toEqual(mockGame);
      expect(service.findOne).toHaveBeenCalledWith(7);
    });

    it('should throw a Not Found Exception', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Game not found with ID 2'));
      await expect(controller.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('all games', () => {
    it('should return list of games', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockGame]);
      expect(service.findAll).toHaveBeenCalled();
    });
    it('should return empty list', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);
      const result = await controller.findAll();
      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create game', () => {
    it('should create a new game and return game', async () => {
      const mockFile = {} as Express.Multer.File;
      const result = await controller.create(
        mockCreateGameDto,
        mockUser,
        mockFile,
      );
      expect(result).toEqual(mockGame);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe('update game', () => {
    it('should update a game and return updated game', async () => {
      const mockUpdateGameDto = { title: 'updated title' };
      const updatedGame = { ...mockGame, ...mockUpdateGameDto };
      jest.spyOn(service, 'update').mockResolvedValue(updatedGame);

      const result = await controller.update('10', mockUpdateGameDto, mockUser);
      expect(result).toEqual(updatedGame);
      expect(service.update).toHaveBeenCalledWith(
        10,
        mockUpdateGameDto,
        mockUser,
      );
    });

    it('should throw a Not Found Exception when updating non-existing game', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new NotFoundException('Game not found with ID 2'));
      await expect(
        controller.update('2', { title: 'new title' }, mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete game', () => {
    it('should delete a game and return undefined', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove('10', mockUser);
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(10, mockUser);
    });

    it('should throw a Not Found Exception when deleting non-existing game', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValue(new NotFoundException('Game not found with ID 2'));
      await expect(controller.remove('2', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
