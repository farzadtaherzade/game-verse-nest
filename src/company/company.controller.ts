import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from 'src/authentication/guards/jwt-auth.guard';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCompanyDto: CreateCompanyDto, @GetUser() user: User) {
    return this.companyService.create(createCompanyDto, user);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }

  @Get('/search/:name')
  search(@Param('name') name: string) {
    return this.companyService.search(name);
  }

  @Get('/my-companies')
  @UseGuards(JwtAuthGuard)
  findMyCompanies(@GetUser() user: User) {
    return this.companyService.findMyCompanies(user);
  }
}
