import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { GetFinancialRecordsDto } from '../../models/financial-records/dto/get-financial-records.dto';
import { FinancialRecords } from '../../models/financial-records/entities/financial-records.entity';

@Injectable()
export class FinancialRecordsProfile extends AutomapperProfile {

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper: Mapper): void => {
      createMap(
        mapper,
        FinancialRecords,
        GetFinancialRecordsDto,
      );
    };
  };

};