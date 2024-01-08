import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateGlobalConfigDTO {
  @ApiProperty({
    type: Number,
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  readonly otpExpiresInMin!: number;

  @ApiProperty({
    type: Boolean,
    required: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly isVarificationRequiredAfterRegister!: boolean;

  @IsOptional()
  @IsNumber()
  readonly updatedBy!: any;
}
