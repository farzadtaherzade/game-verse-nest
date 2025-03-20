import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
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
import { ApiResponse } from 'src/shared/responses/api.response';
import { PaginatedResponse } from 'src/shared/responses/paginated.response';
import { Paginate } from 'src/shared/decorators/paginate.decorator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

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
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @GetUser() user: User,
  ): Promise<ApiResponse<Company>> {
    const company = await this.companyService.create(createCompanyDto, user);
    return new ApiResponse(
      company,
      'Company created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @ApiOkResponse({
    description: 'List of all companies.',
    type: [Company],
  })
  @Paginate()
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<ApiResponse<PaginatedResponse<Company>>> {
    const { companies, meta } = await this.companyService.findAll(pagination);
    const response = new PaginatedResponse(
      companies,
      meta.limit,
      meta.page,
      meta.total,
    );

    return new ApiResponse(
      response,
      'Companies retrieved successfully',
      HttpStatus.OK,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company by id' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiOkResponse({
    description: 'The company has been found.',
    type: Company,
  })
  @ApiNotFoundResponse({ description: 'Company not found.' })
  async findOne(@Param('id') id: string): Promise<ApiResponse<Company>> {
    const company = await this.companyService.findOne(+id);
    return new ApiResponse(
      company,
      'Company retrieved successfully',
      HttpStatus.OK,
    );
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
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<ApiResponse<Company>> {
    const company = await this.companyService.update(+id, updateCompanyDto);
    return new ApiResponse(
      company,
      'Company updated successfully',
      HttpStatus.OK,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a company' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiOkResponse({ description: 'The company has been successfully deleted.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'Company not found.' })
  async remove(@Param('id') id: string): Promise<ApiResponse<Company>> {
    const company = await this.companyService.remove(+id);
    return new ApiResponse(
      company,
      'Company deleted successfully with id: ' + id,
      HttpStatus.OK,
    );
  }

  @Get('/search/:name')
  @ApiOperation({ summary: 'Search companies by name' })
  @ApiParam({ name: 'name', description: 'Company name to search for' })
  @ApiOkResponse({
    description: 'List of companies matching the search criteria.',
    type: [Company],
  })
  @Paginate()
  async search(
    @Param('name') name: string,
    @Query() pagination: PaginationDto,
  ): Promise<ApiResponse<PaginatedResponse<Company>>> {
    const { companies, meta } = await this.companyService.search(
      name,
      pagination,
    );
    const response = new PaginatedResponse(
      companies,
      meta.limit,
      meta.page,
      meta.total,
    );
    return new ApiResponse(
      response,
      'Companies retrieved successfully',
      HttpStatus.OK,
    );
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
  @Paginate()
  async findMyCompanies(
    @GetUser() user: User,
    @Query() pagination: PaginationDto,
  ): Promise<ApiResponse<PaginatedResponse<Company>>> {
    const { companies, meta } = await this.companyService.findMyCompanies(
      user,
      pagination,
    );
    const response = new PaginatedResponse(
      companies,
      meta.limit,
      meta.page,
      meta.total,
    );

    return new ApiResponse(
      response,
      'Companies retrieved successfully',
      HttpStatus.OK,
    );
  }
}
