import * as fs from 'fs-extra';

/**
 * Helper script to generate Module, Controller, Service, Entity, Profile, and DTOs,
 * After generating you need to go to the entity and DTOs to populate fields
 * Add more profiles, if need be
 *
 * Usage: e.g. to generate for employee, run the command below
 * npm run generate-crud employee
 * Optionally you can run the command: npm run generate-crud employee _f to also generate a filter dto
 * NOTE: You need to register the module on AppModule
 * NOTE: If you generate the filter dto you can view and and uncomment line 6 if you have a
 * shared filter dto to extend then remove line 7
 * You might need to also go to each file and lint/format
 *
 * OPEN/CLOSED PRINCIPLE APPLIES.
 */

function toCamelCase(input: string): string {
  return input.replace(/[-_](.)/g, (_, group1) => group1.toUpperCase());
}

/**
 * Checks if the file name argument is provided
 */
function allowGenerate(): boolean {
  return !(process.argv.length < 3);
}

if (!allowGenerate()) {
  console.error('Please provide a file name as an argument.');
} else {
  const fileNameArg: string = process.argv[2]; //file or entity name that came as argument
  const filterDtoArg: string = process.argv[3]; // "_f" argument, if provided will generate filter dto
  console.log(filterDtoArg);
  let fileName: string = toCamelCase(fileNameArg + 'Controller'); //file name camel cased, to be used for controller or service declaration
  const starter: string = fileName[0];
  fileName = fileName.replace(fileName[0], starter.toUpperCase());
  const serviceNameVar: string = toCamelCase(fileNameArg + '_service');
  const serviceName: string = fileName.replace('Controller', 'Service');
  const apiTag: string = fileName.replace('Controller', ''); // api tag, used as entity name also

  //DTOs
  const createVAr: string = `create${apiTag}Dto`; //variable
  const createModel: string = `Create${apiTag}Dto`; //Model

  const updateVAr: string = `update${apiTag}Dto`;
  const updateModel: string = `Update${apiTag}Dto`;

  const getModel: string = `Get${apiTag}Dto`;
  const getModelFilter: string = `Get${apiTag}FilterDto`;

  async function generateDtos(): Promise<void> {
    const createPath: string = `src/models/${fileNameArg}/dto/create-${fileNameArg}.dto.ts`;
    const updatePath: string = `src/models/${fileNameArg}/dto/update-${fileNameArg}.dto.ts`;
    const getPath: string = `src/models/${fileNameArg}/dto/get-${fileNameArg}.dto.ts`;
    const getFilterPath: string = `src/models/${fileNameArg}/dto/get-${fileNameArg}-filter.dto.ts`;

    const createContent: string = `import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
 
export class ${createModel} {

  @ApiProperty()
  @IsString()
  temp: string;

};`;

    const updateContent: string = `import { ${createModel} } from "./create-${fileNameArg}.dto";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ${updateModel} extends PartialType(${createModel}) {

  @ApiProperty()
  @IsString()
  id: string;

};`;

    const getContent: string = `import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";

export class ${getModel} {

  @AutoMap()
  @ApiProperty()
  id: string;

};`;

    const getContentFilter: string = `import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

// Uncomment the following line and do import if you have a base filter dto in your project
// export class ${getModelFilter} extends GetFilterDto {
export class ${getModelFilter} {

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  temp: string;

};`;

    try {
      await fs.outputFile(createPath, createContent, 'utf8');
      await fs.outputFile(updatePath, updateContent, 'utf8');
      await fs.outputFile(getPath, getContent, 'utf8');
      if (filterDtoArg && filterDtoArg === '_f')
        await fs.outputFile(getFilterPath, getContentFilter, 'utf8');
      console.log(`DTOs Created`);
    } catch (error) {
      console.error(`Error creating DTOs: ${error}`);
    }
  }
  async function generateController(): Promise<void> {
    const controllerPath: string = `src/models/${fileNameArg}/${fileNameArg}.controller.ts`;
    const fileContent: string = `import { 
  Controller, 
  Delete, 
  Get, 
  Post, 
  Put, 
  Param, 
  Body${
    filterDtoArg === '_f'
      ? `,
  Query`
      : ''
  }
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ${serviceName} } from './${fileNameArg}.service';
import { ${createModel} } from './dto/create-${fileNameArg}.dto';
import { ${updateModel} } from './dto/update-${fileNameArg}.dto';
import { ${getModel} } from './dto/get-${fileNameArg}.dto';${
      filterDtoArg === '_f'
        ? `
import { ${getModelFilter} } from './dto/get-${fileNameArg}-filter.dto';`
        : ''
    }

@ApiBearerAuth()
@ApiTags('${apiTag}')
@Controller('${fileNameArg}')
export class ${fileName} {

  constructor(private readonly ${serviceNameVar}: ${serviceName}) {}

  @Post('create')
  @ApiOkResponse({ type: ${getModel} })
  @ApiOperation({ operationId: 'create' })
  create(@Body() ${createVAr}: ${createModel}): Promise<${getModel}> {
    return this.${serviceNameVar}.create(${createVAr});
  };

  @Put('update')
  @ApiOkResponse({ type: ${getModel} })
  @ApiOperation({ operationId: 'update' })
  update(@Body() ${updateVAr}: ${updateModel}): Promise<${getModel}> {
    return this.${serviceNameVar}.update(${updateVAr});
  };

  @Delete(':id')
  @ApiOkResponse({ type: ${getModel} })
  @ApiOperation({ operationId: 'delete' })
  remove(@Param('id') id: string): Promise<${getModel}> {
    return this.${serviceNameVar}.remove(id);
  };

  @Get('find-by-id/:id')
  @ApiOkResponse({ type: ${getModel} })
  @ApiOperation({ operationId: 'findOne' })
  findOne(@Param('id') id: string): Promise<${getModel}> {
    return this.${serviceNameVar}.findOne(id);
  };

  @Get('find-many')
  @ApiOkResponse({ type: ${getModel}, isArray: true })
  @ApiOperation({ operationId: 'findMany' })
  findMany(${filterDtoArg === '_f' ? `@Query() params: ${getModelFilter}` : ''}): Promise<${getModel}[]> {
    return this.${serviceNameVar}.findMany(${filterDtoArg === '_f' ? `params` : ''});
  };

};`;

    try {
      await fs.outputFile(controllerPath, fileContent, 'utf8');
      console.log(`Controller Created`);
    } catch (error) {
      console.error(`Error creating Controller: ${error}`);
    }
  }

  async function generateService(): Promise<void> {
    const servicePath: string = `src/models/${fileNameArg}/${fileNameArg}.service.ts`;
    const serviceContent: string = `import { 
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { ${apiTag} } from './entities/${fileNameArg}.entity';
import { ${createModel} } from './dto/create-${fileNameArg}.dto';
import { ${updateModel} } from './dto/update-${fileNameArg}.dto';
import { ${getModel} } from './dto/get-${fileNameArg}.dto';${
      filterDtoArg === '_f'
        ? `
import { ${getModelFilter} } from './dto/get-${fileNameArg}-filter.dto';`
        : ''
    }

@Injectable()
export class ${serviceName} {

  logger: Logger = new Logger(${serviceName}.name)

  constructor(
    @InjectRepository(${apiTag})
    private readonly ${apiTag.charAt(0).toLowerCase() + apiTag.substring(1)}Repository: Repository<${apiTag}>,
    @InjectMapper() 
    private readonly mapper: Mapper,
  ) {}

  create = async (${createVAr}: ${createModel}): Promise<${getModel}> => {
    try {
      const result: ${apiTag} = await this.${apiTag.charAt(0).toLowerCase() + apiTag.substring(1)}Repository.save(${createVAr});
      return this.mapper.map(
        result, 
        ${apiTag}, 
        ${getModel}
      );
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    };
  };

  update = async (${updateVAr}: ${updateModel}): Promise<${getModel}> => {
    try {
      const existing: ${apiTag} = await this.${apiTag.charAt(0).toLowerCase() + apiTag.substring(1)}Repository.findOne({
        where: { id: ${updateVAr}.id },
      });
      if(!existing) throw new NotFoundException();
      const toUpdate: ${apiTag} = Object.assign(new ${apiTag}, existing, ${updateVAr});
      const result: ${apiTag} = await toUpdate.save();
      return this.mapper.map(
        result,
        ${apiTag},
        ${getModel},
      );
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    };
  };

  remove = async (id: string): Promise<${getModel}> => {
    try {
      const existing: ${apiTag} = await this.${apiTag.charAt(0).toLowerCase() + apiTag.substring(1)}Repository.findOneBy({id});
      if(!existing) throw new NotFoundException();
      const result: ${apiTag} = await existing.remove();
      result.id = id;
      return this.mapper.map(
        result,
        ${apiTag},
        ${getModel},
      );
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    };
  };

  findOne = async (id: string): Promise<${getModel}> => {
    try {
      const result: ${apiTag} = await this.${apiTag.charAt(0).toLowerCase() + apiTag.substring(1)}Repository.findOneBy({id});
      return this.mapper.map(
        result,
        ${apiTag},
        ${getModel},
      );
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    };
  };

  ${
    filterDtoArg === '_f'
      ? `findMany = async (params: ${getModelFilter}): Promise<${getModel}[]> => {
    try {
      const {  } = params;
      const query = this.${apiTag.charAt(0).toLowerCase() + apiTag.substring(1)}Repository.createQueryBuilder('${apiTag.toLowerCase()}');
      const results: ${apiTag}[] = await query.getMany();
      return this.mapper.mapArray(
        results,
        ${apiTag},
        ${getModel},
      );
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    };
  };`
      : `findMany = async (): Promise<${getModel}[]> => {
    try {
      const results: ${apiTag}[] = await this.${apiTag.charAt(0).toLowerCase() + apiTag.substring(1)}Repository.find();
      return this.mapper.mapArray(
        results,
        ${apiTag},
        ${getModel},
      );
    } catch (error: any) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    };
  };`
  }

};`;

    try {
      await fs.outputFile(servicePath, serviceContent, 'utf8');
      console.log(`Service Created`);
    } catch (error) {
      console.error(`Error creating Service: ${error}`);
    }
  }

  async function generateEntity(): Promise<void> {
    const entityPath: string = `src/models/${fileNameArg}/entities/${fileNameArg}.entity.ts`;
    const entityContent: string = `import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from '../../../shared/models/custom-base.entity';
import { AutoMap } from '@automapper/classes';

@Entity()
export class ${apiTag} extends CustomBaseEntity {

  @AutoMap()
  @Column()
  temp: string;

};`;

    try {
      await fs.outputFile(entityPath, entityContent, 'utf8');
      console.log(`Entity Created`);
    } catch (error) {
      console.error(`Error creating Entity: ${error}`);
    }
  }

  async function generateModule(): Promise<void> {
    const modulePath: string = `src/models/${fileNameArg}/${fileNameArg}.module.ts`;
    const moduleContent: string = `import { Module } from '@nestjs/common';
import { ${apiTag}Service } from './${fileNameArg}.service';
import { ${apiTag}Controller } from './${fileNameArg}.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${apiTag} } from './entities/${fileNameArg}.entity';
import { ${apiTag}Profile } from '../../shared/profiles/${fileNameArg}.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([${apiTag}]),
  ],
  controllers: [${apiTag}Controller],
  providers: [${apiTag}Service, ${apiTag}Profile],
})
export class ${apiTag}Module {}`;

    try {
      await fs.outputFile(modulePath, moduleContent, 'utf8');
      console.log(`Module Created`);
    } catch (error) {
      console.error(`Error creating Module: ${error}`);
    }
  }

  async function generateProfile(): Promise<void> {
    const profilePath: string = `src/shared/profiles/${fileNameArg}.profile.ts`;
    const profileContent: string = `import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { ${getModel} } from '../../models/${fileNameArg}/dto/get-${fileNameArg}.dto';
import { ${apiTag} } from '../../models/${fileNameArg}/entities/${fileNameArg}.entity';

@Injectable()
export class ${apiTag}Profile extends AutomapperProfile {

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper: Mapper): void => {
      createMap(
        mapper,
        ${apiTag},
        ${getModel},
      );
    };
  };

};`;

    try {
      await fs.outputFile(profilePath, profileContent, 'utf8');
      console.log(`Profile Created`);
    } catch (error) {
      console.error(`Error creating Profile: ${error}`);
    }
  }

  async function doGenerate(): Promise<void> {
    await generateDtos().then();
    await generateEntity().then();
    await generateService().then();
    await generateController().then();
    await generateModule().then();
    await generateProfile().then();
  }
  doGenerate().then();
}