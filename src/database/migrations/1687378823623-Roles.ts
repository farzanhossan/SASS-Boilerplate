import {
  ENUM_COLUMN_TYPES,
  ENUM_TABLE_NAMES,
  defaultColumns,
  defaultDateTimeColumns,
  defaultPrimaryColumn,
} from '@src/shared';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Roles1687378823623 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: ENUM_TABLE_NAMES.ROLES,
        columns: [
          defaultPrimaryColumn,
          {
            name: 'title',
            type: ENUM_COLUMN_TYPES.VARCHAR,
            length: '256',
            isNullable: false,
          },
          ...defaultDateTimeColumns,
          ...defaultColumns,
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(ENUM_TABLE_NAMES.ROLES);
  }
}
