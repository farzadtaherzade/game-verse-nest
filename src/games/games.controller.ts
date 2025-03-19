import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Query,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { GetUser } from '../shared/decorators/user.decorator';
import { User } from '../entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterUtils } from 'src/shared/utils/multer.utils';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Paginate } from 'src/shared/decorators/paginate.decorator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { ApiResponse } from 'src/shared/responses/api.response';
import { PaginatedResponse } from 'src/shared/responses/paginated.response';
import { Game } from 'src/entities/game.entity';
@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterUtils.storage('/games'),
    }),
  )
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create a new game with file upload',
    type: CreateGameDto,
  })
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createGameDto: CreateGameDto,
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5000 })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ApiResponse<Game>> {
    const game = await this.gamesService.create(createGameDto, user, file);
    return new ApiResponse(
      game,
      'Game created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get()
  @Paginate()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<ApiResponse<PaginatedResponse<Game>>> {
    const { data, meta } = await this.gamesService.findAll(paginationDto);
    const pagination = new PaginatedResponse(
      data,
      meta.limit,
      meta.page,
      meta.totalItems,
    );
    return new ApiResponse(
      pagination,
      'Games retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Game>> {
    const game = await this.gamesService.findOne(+id);
    return new ApiResponse(game, 'Game retrieved successfully', HttpStatus.OK);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
    @GetUser() user: User,
  ): Promise<ApiResponse<Game>> {
    const game = await this.gamesService.update(+id, updateGameDto, user);
    return new ApiResponse(game, 'Game updated successfully', HttpStatus.OK);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<ApiResponse<{ message: string }>> {
    const game = await this.gamesService.remove(+id, user);
    return new ApiResponse(game, 'Game deleted successfully', HttpStatus.OK);
  }
}
