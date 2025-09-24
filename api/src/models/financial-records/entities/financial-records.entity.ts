import { Column, Entity } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { CustomBaseEntity } from '../../../shared/models/custom-base.entity';

@Entity()
export class FinancialRecords extends CustomBaseEntity {

  @ApiProperty()
  @AutoMap()
  @Column()
  temp!: string;

}