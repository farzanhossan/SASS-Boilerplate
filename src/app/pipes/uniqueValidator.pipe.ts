import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource, EntitySchema, FindOptionsWhere } from 'typeorm';

export interface UniqueValidationArguments<E> extends ValidationArguments {
  constraints: [
    EntitySchema<E>,
    ((validationArguments: ValidationArguments) => FindOptionsWhere<E>) | keyof E,
  ];
}

@ValidatorConstraint({
  name: 'UniqueValidatorPipe',
  async: true,
})
@Injectable()
export class UniqueValidatorPipe<T> implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  public async validate<E>(value: string, args: UniqueValidationArguments<T>) {
    const [EntityClass, whereConditions] = args.constraints;
    const filters = typeof whereConditions === 'function' ? whereConditions(args) : whereConditions;

    const isExist = await this.dataSource.getRepository(EntityClass).findOne({
      where: filters as FindOptionsWhere<T>,
    });

    return isExist ? false : true;
  }

  public defaultMessage(args: ValidationArguments) {
    return `${args.property} '${args.value}' already exists`;
  }
}
