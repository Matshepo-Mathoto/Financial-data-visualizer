import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";

export class GetFinancialRecordsDto {

  @AutoMap()
  @ApiProperty()
  id: string;

};