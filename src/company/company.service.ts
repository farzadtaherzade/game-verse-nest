import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Repository } from 'typeorm';

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

  async findAll() {
    const [companies, count] = await this.companyRepository.findAndCount();
    return {
      companies,
      pagination: {
        total: count,
        length: companies.length,
      },
    };
  }

  async findMyCompanies(user: User) {
    const [companies, count] = await this.companyRepository.findAndCount({
      where: { user: { id: user.id } },
    });
    return {
      companies,
      pagination: {
        total: count,
        length: companies.length,
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
}
