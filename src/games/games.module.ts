import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../entities/game.entity';
import { GenresModule } from 'src/genres/genres.module';
import { Platform } from 'src/entities/platform.entity';
import { Company } from 'src/entities/company.entity';
import { UtilsModule } from 'src/common/utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, Platform, Company]),
    GenresModule,
    UtilsModule,
  ],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
