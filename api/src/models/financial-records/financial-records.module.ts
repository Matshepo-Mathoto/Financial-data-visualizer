import { Module } from '@nestjs/common';
import { FinancialRecordsService } from './financial-records.service';
import { FinancialRecordsController } from './financial-records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialRecords } from './entities/financial-records.entity';
import { FinancialRecordsProfile } from '../../shared/profiles/financial-records.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([FinancialRecords]),
  ],
  controllers: [FinancialRecordsController],
  providers: [FinancialRecordsService, FinancialRecordsProfile],
})
export class FinancialRecordsModule {}