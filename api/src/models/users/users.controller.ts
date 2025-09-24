import { 
  Controller, 
  Delete, 
  Get, 
  Post, 
  Put, 
  Param, 
  Body
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { GetUsersDto } from './dto/get-users.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @ApiOkResponse({ type: GetUsersDto })
  @ApiOperation({ operationId: 'create' })
  create(@Body() createUsersDto: CreateUsersDto): Promise<GetUsersDto> {
    return this.usersService.create(createUsersDto);
  };

  @Put('update')
  @ApiOkResponse({ type: GetUsersDto })
  @ApiOperation({ operationId: 'update' })
  update(@Body() updateUsersDto: UpdateUsersDto): Promise<GetUsersDto> {
    return this.usersService.update(updateUsersDto);
  };

  @Delete(':id')
  @ApiOkResponse({ type: GetUsersDto })
  @ApiOperation({ operationId: 'delete' })
  remove(@Param('id') id: string): Promise<GetUsersDto> {
    return this.usersService.remove(id);
  };

  @Get('find-by-id/:id')
  @ApiOkResponse({ type: GetUsersDto })
  @ApiOperation({ operationId: 'findOne' })
  findOne(@Param('id') id: string): Promise<GetUsersDto> {
    return this.usersService.findOne(id);
  };

  @Get('find-many')
  @ApiOkResponse({ type: GetUsersDto, isArray: true })
  @ApiOperation({ operationId: 'findMany' })
  findMany(): Promise<GetUsersDto[]> {
    return this.usersService.findMany();
  };

};