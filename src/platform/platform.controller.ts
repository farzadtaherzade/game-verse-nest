import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Platform')
@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new platform' })
  @ApiResponse({ status: 201, description: 'Platform successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createDto: CreatePlatformDto) {
    return this.platformService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all platforms' })
  @ApiResponse({ status: 200, description: 'Return all platforms.' })
  async getPlatforms() {
    return this.platformService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search platforms by keyword' })
  @ApiQuery({ name: 'keyword', required: true, description: 'Search keyword' })
  @ApiResponse({ status: 200, description: 'Return matching platforms.' })
  async search(@Query('keyword') keyword: string) {
    console.log(keyword);
    return this.platformService.searchPlatform(keyword.toLowerCase());
  }
}
