import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { CreatePlatformDto } from './dto/create-platform.dto';

@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Post()
  async create(@Body() createDto: CreatePlatformDto) {
    return this.platformService.create(createDto);
  }

  @Get()
  async getPlatforms() {
    return this.platformService.findAll();
  }

  @Get('search')
  async search(@Query('keyword') keyword: string) {
    console.log(keyword);
    return this.platformService.searchPlatform(keyword.toLowerCase());
  }
}
