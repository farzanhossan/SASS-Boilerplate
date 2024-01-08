import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { CreatePermissionTypeDTO, FilterPermissionTypeDTO, UpdatePermissionTypeDTO } from '../dtos';
import { PermissionType } from '../entities/permissionType.entity';
import { PermissionTypeService } from '../services/permissionType.service';
import { ResponseInterceptor } from '@src/app/interceptors';
import { AuthGuard } from '@nestjs/passport';
import { JWT_STRATEGY } from '@src/shared/constants/strategy.constants';

@ApiTags('Permission Type')
@ApiBearerAuth()
@UseInterceptors(ResponseInterceptor)
@Controller('permission-types')
export class PermissionTypeController {
  RELATIONS = [];
  constructor(private readonly service: PermissionTypeService) {}

  @Get()
  //   @Roles('admin')
  //   @PermissionChecker('admin.read')
  @UseGuards(
    AuthGuard(JWT_STRATEGY),
    //   RolesGuard,
    //   PermissionsGuard
  )
  async findAll(
    @Query() query: FilterPermissionTypeDTO,
  ): Promise<SuccessResponse | PermissionType[]> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id')
  //   @Roles('admin')
  //   @PermissionChecker('admin.read')
  @UseGuards(
    AuthGuard(JWT_STRATEGY),
    //   RolesGuard,
    //   PermissionsGuard
  )
  async findById(@Param('id') id: string): Promise<PermissionType> {
    return this.service.findByIdBase(id, { relations: this.RELATIONS });
  }

  @Post()
  //   @Roles('admin')
  //   @PermissionChecker('admin.read')
  @UseGuards(
    AuthGuard(JWT_STRATEGY),
    //   RolesGuard,
    //   PermissionsGuard
  )
  async createOne(@Body() body: CreatePermissionTypeDTO): Promise<PermissionType> {
    return this.service.createOneBase(body, { relations: this.RELATIONS });
  }

  @Patch(':id')
  //   @Roles('admin')
  //   @PermissionChecker('admin.read')
  @UseGuards(
    AuthGuard(JWT_STRATEGY),
    //   RolesGuard,
    //   PermissionsGuard
  )
  async updateOne(
    @Param('id') id: string,
    @Body() body: UpdatePermissionTypeDTO,
  ): Promise<PermissionType> {
    return this.service.updateOneBase(id, body, { relations: this.RELATIONS });
  }

  @Delete(':id')
  //   @Roles('admin')
  //   @PermissionChecker('admin.read')
  @UseGuards(
    AuthGuard(JWT_STRATEGY),
    //   RolesGuard,
    //   PermissionsGuard
  )
  async deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    return this.service.deleteOneBase(id);
  }
}
