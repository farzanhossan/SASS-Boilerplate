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
import {
  CreateRoleDTO,
  FilterPermissionDTO,
  FilterRoleDTO,
  RemovePermissionsDTO,
  UpdateRoleDTO,
} from '../dtos';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { RoleService } from '../services/role.service';
import { AddPermissionsDTO } from './../dtos/role/addPermissions.dto';

@ApiTags('Role')
@ApiBearerAuth()
@UseInterceptors(ResponseInterceptor)
@Controller('roles')
export class RoleController {
  RELATIONS = [];
  constructor(private readonly service: RoleService) {}

  @Get()
  //   @Roles('admin')
  //   @PermissionChecker('admin.read')
  @UseGuards(
    AuthGuard(JWT_STRATEGY),
    //   RolesGuard,
    //   PermissionsGuard
  )
  async findAll(@Query() query: FilterRoleDTO): Promise<SuccessResponse | Role[]> {
    return this.service.findAllBase(query, { relations: this.RELATIONS });
  }

  @Get(':id/available-permissions')
  //   @Roles('admin')
  //   @PermissionChecker('admin.read')
  @UseGuards(
    AuthGuard(JWT_STRATEGY),
    //   RolesGuard,
    //   PermissionsGuard
  )
  async availablePermissions(
    @Param('id') id: string,
    @Query() query: FilterPermissionDTO,
  ): Promise<Permission[]> {
    return this.service.availablePermissions(id, query);
  }

  @Get(':id')
  //   @Roles('admin')
  //   @PermissionChecker('admin.read')
  @UseGuards(
    AuthGuard(JWT_STRATEGY),
    //   RolesGuard,
    //   PermissionsGuard
  )
  async findById(@Param('id') id: string): Promise<Role> {
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
  async createOne(@Body() body: CreateRoleDTO): Promise<Role> {
    return this.service.createOneBase(body, { relations: this.RELATIONS });
  }

  @Post(':id/add-permissions')
  //   @Roles('admin')
  //   @PermissionChecker('admin.read')
  @UseGuards(
    AuthGuard(JWT_STRATEGY),
    //   RolesGuard,
    //   PermissionsGuard
  )
  async addPermission(
    @Param('id') id: string,
    @Body() body: AddPermissionsDTO,
  ): Promise<Permission[]> {
    return this.service.addPermissions(id, body);
  }

  @Patch(':id')
  //   @Roles('admin')
  //   @PermissionChecker('admin.read')
  @UseGuards(
    AuthGuard(JWT_STRATEGY),
    //   RolesGuard,
    //   PermissionsGuard
  )
  async updateOne(@Param('id') id: string, @Body() body: UpdateRoleDTO): Promise<Role> {
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

  @Delete(':id/remove-permissions')
  //   @Roles('admin')
  //   @PermissionChecker('admin.read')
  @UseGuards(
    AuthGuard(JWT_STRATEGY),
    //   RolesGuard,
    //   PermissionsGuard
  )
  async removePermission(
    @Param('id') id: string,
    @Body() body: RemovePermissionsDTO,
  ): Promise<Permission[]> {
    return this.service.removePermissions(id, body);
  }
}
