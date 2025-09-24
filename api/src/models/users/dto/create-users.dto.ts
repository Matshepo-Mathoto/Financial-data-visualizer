import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
 
export class CreateUsersDto {

  @ApiProperty()
  @IsString()
  name: string;

};