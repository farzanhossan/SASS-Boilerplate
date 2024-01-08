import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/app/types';
import { UpdateGlobalConfigDTO } from '../dtos';
import { GlobalConfig } from '../entities/globalConfig.entity';
import { GlobalConfigService } from '../services/globalConfig.service';

@ApiTags('GlobalConfig')
@ApiBearerAuth()
@Controller('global-configs')
export class GlobalConfigController {
  RELATIONS = [];
  constructor(private readonly service: GlobalConfigService) {}

  @Get()
  async find(): Promise<SuccessResponse | GlobalConfig> {
    return this.service.getConfigs();
  }

  @Patch(':id')
  async updateOne(
    @Param('id') id: number | string,
    @Body() body: UpdateGlobalConfigDTO,
  ): Promise<GlobalConfig> {
    return this.service.updateOneBase(id as any, body, { relations: this.RELATIONS });
  }
}
