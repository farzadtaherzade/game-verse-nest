import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Like, Repository } from 'typeorm';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, user: User) {
    const company = this.companyRepository.create({
      ...createCompanyDto,
    });
    company.user = user;
    return await this.companyRepository.save(company);
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const [companies, count] = await this.companyRepository.findAndCount({
      take: limit,
      skip: limit * (page - 1),
    });
    return {
      companies,
      meta: {
        total: count,
        length: companies.length,
        page,
        limit,
      },
    };
  }

  async findMyCompanies(user: User, pageDto: PaginationDto) {
    const { page = 1, limit = 10 } = pageDto;
    const [companies, count] = await this.companyRepository.findAndCount({
      where: { user: { id: user.id } },
      take: limit,
      skip: limit * (page - 1),
    });
    return {
      companies,
      meta: {
        total: count,
        length: companies.length,
        page,
        limit,
      },
    };
  }

  async findOne(id: number) {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.findOne(id);

    Object.assign(company, updateCompanyDto);
    return await this.companyRepository.save(company);
  }

  async remove(id: number) {
    const company = await this.findOne(id);
    return await this.companyRepository.remove(company);
  }

  async search(name: string, pageDto: PaginationDto) {
    const { page = 1, limit = 10 } = pageDto;
    const [companies, count] = await this.companyRepository.findAndCount({
      where: {
        name: Like(`%${name}%`),
      },
      take: limit,
      skip: limit * (page - 1),
    });
    return {
      companies,
      meta: {
        total: count,
        length: companies.length,
        page,
        limit,
      },
    };
  }
}
