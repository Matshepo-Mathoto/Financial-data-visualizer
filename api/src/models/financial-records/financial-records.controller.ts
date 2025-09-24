import { 
  Controller, 
  Delete, 
  Get, 
  Post, 
  Put, 
  Param, 
  Body
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FinancialRecordsService } from './financial-records.service';
import { CreateFinancialRecordsDto } from './dto/create-financial-records.dto';
import { UpdateFinancialRecordsDto } from './dto/update-financial-records.dto';
import { GetFinancialRecordsDto } from './dto/get-financial-records.dto';

@ApiBearerAuth()
@ApiTags('FinancialRecords')
@Controller('financial-records')
export class FinancialRecordsController {

  constructor(private readonly financialRecordsService: FinancialRecordsService) {}

  @Post('create')
  @ApiOkResponse({ type: GetFinancialRecordsDto })
  @ApiOperation({ operationId: 'create' })
  create(@Body() createFinancialRecordsDto: CreateFinancialRecordsDto): Promise<GetFinancialRecordsDto> {
    return this.financialRecordsService.create(createFinancialRecordsDto);
  };

  @Put('update')
  @ApiOkResponse({ type: GetFinancialRecordsDto })
  @ApiOperation({ operationId: 'update' })
  update(@Body() updateFinancialRecordsDto: UpdateFinancialRecordsDto): Promise<GetFinancialRecordsDto> {
    return this.financialRecordsService.update(updateFinancialRecordsDto);
  };

  @Delete(':id')
  @ApiOkResponse({ type: GetFinancialRecordsDto })
  @ApiOperation({ operationId: 'delete' })
  remove(@Param('id') id: string): Promise<GetFinancialRecordsDto> {
    return this.financialRecordsService.remove(id);
  };

  @Get('find-by-id/:id')
  @ApiOkResponse({ type: GetFinancialRecordsDto })
  @ApiOperation({ operationId: 'findOne' })
  findOne(@Param('id') id: string): Promise<GetFinancialRecordsDto> {
    return this.financialRecordsService.findOne(id);
  };

  @Get('find-many')
  @ApiOkResponse({ type: GetFinancialRecordsDto, isArray: true })
  @ApiOperation({ operationId: 'findMany' })
  findMany(): Promise<GetFinancialRecordsDto[]> {
    return this.financialRecordsService.findMany();
  };

};