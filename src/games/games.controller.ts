import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  HttpStatus,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import { User } from '../entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterUtils } from 'src/common/utils/multer.utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Game created' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create a new game with file upload',
    type: CreateGameDto,
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: MulterUtils.storage('/games'),
    }),
  )
  @Post()
  create(
    @Body() createGameDto: CreateGameDto,
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5000 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.gamesService.create(createGameDto, user, file);
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
    @GetUser() user: User,
  ) {
    return this.gamesService.update(+id, updateGameDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.gamesService.remove(+id, user);
  }
}
