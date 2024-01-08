import { ApiProperty } from '@nestjs/swagger';
import { UniqueValidatorPipe } from '@src/app/pipes/uniqueValidator.pipe';
import { IsNotEmpty, IsString, Validate, ValidationArguments } from 'class-validator';
import { FindOptionsWhere } from 'typeorm';
import { PermissionType } from '../../entities/permissionType.entity';

export class CreatePermissionTypeDTO {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Product Management',
  })
  @IsNotEmpty()
  @IsString()
  @Validate(UniqueValidatorPipe<PermissionType>, [
    PermissionType,
    (args: ValidationArguments): FindOptionsWhere<PermissionType> => {
      const dto = args.object as CreatePermissionTypeDTO;
      return {
        title: dto.title,
      };
    },
  ])
  readonly title!: string;
}
