import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '@src/app/base';
import { IsOptional, IsUUID } from 'class-validator';

export class FilterPermissionDTO extends BaseDTO {
  @ApiProperty({
    type: String,
    description: 'permission type id',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  readonly permissionType!: any;
}
