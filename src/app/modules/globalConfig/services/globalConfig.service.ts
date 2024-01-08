import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@src/app/base';
import { DataSource, Repository } from 'typeorm';
import { GlobalConfig } from '../entities/globalConfig.entity';

@Injectable()
export class GlobalConfigService extends BaseService<GlobalConfig> {
  constructor(
    @InjectRepository(GlobalConfig)
    private readonly _repo: Repository<GlobalConfig>,
    private readonly dataSource: DataSource,
  ) {
    super(_repo);
  }

  async getConfigs(): Promise<GlobalConfig> {
    const configs = await this.find();
    if (!configs[0]) {
      throw new NotFoundException(
        'Configuration parameters are missing. Please check configurations !!!',
      );
    }
    return configs[0];
  }
}
