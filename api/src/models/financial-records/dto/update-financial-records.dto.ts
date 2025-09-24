import { CreateFinancialRecordsDto } from "./create-financial-records.dto";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateFinancialRecordsDto extends PartialType(CreateFinancialRecordsDto) {

  @ApiProperty()
  @IsString()
  id: string;

};