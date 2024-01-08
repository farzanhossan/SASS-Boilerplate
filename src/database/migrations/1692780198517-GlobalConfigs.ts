import {
  ENUM_COLUMN_TYPES,
  ENUM_TABLE_NAMES,
  defaultColumns,
  defaultDateTimeColumns,
  defaultPrimaryColumn,
} from '@src/shared';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class GlobalConfigs1692780198517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: ENUM_TABLE_NAMES.GLOBAL_CONFIGS,
        columns: [
          defaultPrimaryColumn,
          {
            name: 'otpExpiresInMin',
            type: ENUM_COLUMN_TYPES.INT,
            isNullable: true,
            default: 120,
          },
          {
            name: 'isVarificationRequiredAfterRegister',
            type: ENUM_COLUMN_TYPES.BOOLEAN,
            isNullable: false,
            default: false,
          },
          {
            name: 'updatedById',
            type: ENUM_COLUMN_TYPES.PRIMARY_KEY,
            isNullable: true,
          },
          ...defaultDateTimeColumns,
          ...defaultColumns,
        ],
        foreignKeys: [
          {
            name: 'FK_UPDTAE_GC_USER',
            columnNames: ['updatedById'],
            referencedTableName: ENUM_TABLE_NAMES.USERS,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(ENUM_TABLE_NAMES.GLOBAL_CONFIGS);
    await queryRunner.dropForeignKey(
      ENUM_TABLE_NAMES.GLOBAL_CONFIGS,
      table.foreignKeys.find((fk) => fk.columnNames.indexOf('updatedById') !== -1),
    );
    await queryRunner.dropTable(ENUM_TABLE_NAMES.GLOBAL_CONFIGS);
  }
}
