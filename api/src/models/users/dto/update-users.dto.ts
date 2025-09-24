import { CreateUsersDto } from "./create-users.dto";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateUsersDto extends PartialType(CreateUsersDto) {

  @ApiProperty()
  @IsString()
  id: string;

};