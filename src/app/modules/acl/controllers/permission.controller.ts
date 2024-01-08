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
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '@src/app/interceptors';
import { SuccessResponse } from '@src/app/types';
import { JWT_STRATEGY } from '@src/shared/constants/strategy.constants';
import { CreatePermissionDTO, FilterPermissionDTO, UpdatePermissionDTO } from '../dtos';
import { Permission } from '../entities/permission.entity';
import { PermissionService } from '../services/permission.service';

@ApiTags('Permission')
@ApiBearerAuth()
@UseInterceptors(ResponseInterceptor)
@Controller('permissions')
export class PermissionController {
  RELATIONS = ['permissionType'];
  constructor(private readonly service: PermissionService) {}

  @Get()
  //   @Roles('admin')
  //   @PermissionChecker('admin.read')
  @UseGuards(
    AuthGuard(JWT_STRATEGY),
    //   RolesGuard,
    //   PermissionsGuard
  )
  async findAll(@Query() query: FilterPermissionDTO): Promise<SuccessResponse | Permission[]> {
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
  async findById(@Param('id') id: string): Promise<Permission> {
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
  async createOne(@Body() body: CreatePermissionDTO): Promise<Permission> {
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
  async updateOne(@Param('id') id: string, @Body() body: UpdatePermissionDTO): Promise<Permission> {
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
