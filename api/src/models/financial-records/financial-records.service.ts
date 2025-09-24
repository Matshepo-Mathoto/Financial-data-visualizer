import { 
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { FinancialRecords } from './entities/financial-records.entity';
import { CreateFinancialRecordsDto } from './dto/create-financial-records.dto';
import { UpdateFinancialRecordsDto } from './dto/update-financial-records.dto';
import { GetFinancialRecordsDto } from './dto/get-financial-records.dto';

@Injectable()
export class FinancialRecordsService {

  logger: Logger = new Logger(FinancialRecordsService.name)

  constructor(
    @InjectRepository(FinancialRecords)
    private readonly financialRecordsRepository: Repository<FinancialRecords>,
    @InjectMapper() 
    private readonly mapper: Mapper,
  ) {}

  create = async (createFinancialRecordsDto: CreateFinancialRecordsDto): Promise<GetFinancialRecordsDto> => {
    try {
      const result: FinancialRecords = await this.financialRecordsRepository.save(createFinancialRecordsDto);
      return this.mapper.map(
        result, 
        FinancialRecords, 
        GetFinancialRecordsDto
      );
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    };
  };

  update = async (updateFinancialRecordsDto: UpdateFinancialRecordsDto): Promise<GetFinancialRecordsDto> => {
    try {
      const existing: FinancialRecords | null = await this.financialRecordsRepository.findOneBy({ id: updateFinancialRecordsDto.id });
      if(!existing) throw new NotFoundException();
      const toUpdate: FinancialRecords = this.financialRecordsRepository.merge(existing, updateFinancialRecordsDto);
      const result: FinancialRecords = await this.financialRecordsRepository.save(toUpdate);
      return this.mapper.map(
        result,
        FinancialRecords,
        GetFinancialRecordsDto,
      );
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    };
  };

  remove = async (id: string): Promise<GetFinancialRecordsDto> => {
    try {
      const existing: FinancialRecords | null = await this.financialRecordsRepository.findOneBy({ id });
      if(!existing) throw new NotFoundException();
      const result: FinancialRecords = await this.financialRecordsRepository.remove(existing);
      return this.mapper.map(
        result,
        FinancialRecords,
        GetFinancialRecordsDto,
      );
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    };
  };

  findOne = async (id: string): Promise<GetFinancialRecordsDto> => {
    try {
      const result: FinancialRecords | null = await this.financialRecordsRepository.findOneBy({ id });
      return this.mapper.map(
        result,
        FinancialRecords,
        GetFinancialRecordsDto,
      );
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    };
  };

  findMany = async (): Promise<GetFinancialRecordsDto[]> => {
    try {
      const results: FinancialRecords[] = await this.financialRecordsRepository.find();
      return this.mapper.mapArray(
        results,
        FinancialRecords,
        GetFinancialRecordsDto,
      );
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    };
  };

};