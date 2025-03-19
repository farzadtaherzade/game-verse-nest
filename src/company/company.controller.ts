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
import { GetUser } from 'src/shared/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Company } from 'src/entities/company.entity';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new company' })
  @ApiBody({ type: CreateCompanyDto })
  @ApiCreatedResponse({
    description: 'The company has been successfully created.',
    type: Company,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  create(@Body() createCompanyDto: CreateCompanyDto, @GetUser() user: User) {
    return this.companyService.create(createCompanyDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @ApiOkResponse({
    description: 'List of all companies.',
    type: [Company],
  })
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company by id' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiOkResponse({
    description: 'The company has been found.',
    type: Company,
  })
  @ApiNotFoundResponse({ description: 'Company not found.' })
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a company' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiOkResponse({
    description: 'The company has been successfully updated.',
    type: Company,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'Company not found.' })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a company' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiOkResponse({ description: 'The company has been successfully deleted.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'Company not found.' })
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }

  @Get('/search/:name')
  @ApiOperation({ summary: 'Search companies by name' })
  @ApiParam({ name: 'name', description: 'Company name to search for' })
  @ApiOkResponse({
    description: 'List of companies matching the search criteria.',
    type: [Company],
  })
  search(@Param('name') name: string) {
    return this.companyService.search(name);
  }

  @Get('/my-companies')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get companies owned by the current user' })
  @ApiOkResponse({
    description: 'List of companies owned by the current user.',
    type: [Company],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  findMyCompanies(@GetUser() user: User) {
    return this.companyService.findMyCompanies(user);
  }
}
