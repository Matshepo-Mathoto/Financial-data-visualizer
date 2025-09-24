import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";

export class GetUsersDto {

  @AutoMap()
  @ApiProperty()
  id: string;

  @AutoMap()
  @ApiProperty()
  name: string;
};