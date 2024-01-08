import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDTO {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Content Manager',
  })
  @IsOptional()
  @IsString()
  readonly title!: string;
}
