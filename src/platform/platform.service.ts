import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Platform } from 'src/entities/platform.entity';
import { Repository } from 'typeorm';
import { CreatePlatformDto } from './dto/create-platform.dto';
import slugify from 'slugify';

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(Platform)
    private readonly platformRepository: Repository<Platform>,
  ) {}

  async create(createDto: CreatePlatformDto) {
    const slug = slugify(createDto.slug);

    const slugExist = await this.platformRepository.existsBy({
      slug,
    });
    if (slugExist) throw new ConflictException('slug already exists!');

    const nameExist = await this.platformRepository.existsBy({
      name: createDto.name,
    });
    if (nameExist) throw new ConflictException('name platform already exists!');

    const platform = this.platformRepository.create({
      ...createDto,
      slug,
    });
    return this.platformRepository.save(platform);
  }

  async findAll() {
    return this.platformRepository.find();
  }

  async findOne(id: number) {
    const platform = await this.platformRepository.findOne({
      where: {
        id,
      },
    });
    if (!platform) throw new NotFoundException('platform is not available');
    return platform;
  }

  async searchPlatform(keyword: string): Promise<Platform[]> {
    const platform = await this.platformRepository
      .createQueryBuilder('p')
      .where('lower(p.name) like :kw', { kw: keyword })
      .orWhere('lower(p.shortcut) like :kw', { kw: keyword })
      .getMany();
    return platform;
  }
}
