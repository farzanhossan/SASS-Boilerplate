import { ApiProperty } from '@nestjs/swagger';
import { IsUUIDArray } from '@src/app/decorators';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'a@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  readonly identifier!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Zahid',
  })
  @IsOptional()
  @IsString()
  readonly firstName!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Hasan',
  })
  @IsOptional()
  @IsString()
  readonly lastName!: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '01612345678',
  })
  @IsOptional()
  @IsString()
  readonly phoneNumber!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  readonly password!: string;

  @ApiProperty({
    type: [String],
    required: true,
    example: ['7efe629c-3e94-4fa7-a26d-7c5216e41d93', '73f328c1-211a-4dc6-8120-0a02adfedabb'],
  })
  @IsUUIDArray()
  @IsArray()
  readonly roles!: string[];
}
