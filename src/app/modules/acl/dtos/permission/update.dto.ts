import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePermissionDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'catalogs.create',
  })
  @IsOptional()
  @IsString()
  readonly title!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'permission type id',
  })
  @IsOptional()
  @IsUUID()
  readonly permissionType!: any;
}
