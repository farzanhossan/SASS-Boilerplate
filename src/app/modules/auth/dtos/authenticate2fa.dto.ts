import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class Authenticate2faDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: '147852',
  })
  @IsNotEmpty()
  @IsString()
  readonly code!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'aa@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email!: string;

  @IsOptional()
  @IsNumber()
  readonly createdBy!: any;
}
