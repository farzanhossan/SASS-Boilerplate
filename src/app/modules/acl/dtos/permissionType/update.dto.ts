import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePermissionTypeDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Product Management',
  })
  @IsOptional()
  @IsString()
  readonly title!: string;
}
