import { 
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { Users } from './entities/users.entity';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { GetUsersDto } from './dto/get-users.dto';

@Injectable()
export class UsersService {

  logger: Logger = new Logger(UsersService.name)

  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectMapper() 
    private readonly mapper: Mapper,
  ) {}

  create = async (createUsersDto: CreateUsersDto): Promise<GetUsersDto> => {
    try {
      const result: Users = await this.usersRepository.save(createUsersDto);
      return this.mapper.map(
        result, 
        Users, 
        GetUsersDto
      );
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    };
  };

  update = async (updateUsersDto: UpdateUsersDto): Promise<GetUsersDto> => {
    try {
      const existing: Users | null = await this.usersRepository.findOneBy({ id: updateUsersDto.id });
      if(!existing) throw new NotFoundException();
      const toUpdate: Users = this.usersRepository.merge(existing, updateUsersDto);
      const result: Users = await this.usersRepository.save(toUpdate);
      return this.mapper.map(
        result,
        Users,
        GetUsersDto,
      );
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    };
  };

  remove = async (id: string): Promise<GetUsersDto> => {
    try {
      const existing: Users | null = await this.usersRepository.findOneBy({ id });
      if(!existing) throw new NotFoundException();
      const result: Users = await this.usersRepository.remove(existing as Users);
      return this.mapper.map(
        result,
        Users,
        GetUsersDto,
      );
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    };
  };

  findOne = async (id: string): Promise<GetUsersDto> => {
    try {
      const result: Users | null = await this.usersRepository.findOneBy({id});
      return this.mapper.map(
        result,
        Users,
        GetUsersDto,
      );
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    };
  };

  findMany = async (): Promise<GetUsersDto[]> => {
    try {
      const results: Users[] = await this.usersRepository.find();
      return this.mapper.mapArray(
        results,
        Users,
        GetUsersDto,
      );
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    };
  };

};