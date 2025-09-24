import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
 
export class CreateFinancialRecordsDto {

  @ApiProperty()
  @IsString()
  temp: string;

};