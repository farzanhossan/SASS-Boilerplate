import {
  ENUM_COLUMN_TYPES,
  ENUM_TABLE_NAMES,
  defaultColumns,
  defaultDateTimeColumns,
  defaultPrimaryColumn,
} from '@src/shared';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Permissions1687379624626 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: ENUM_TABLE_NAMES.PERMISSIONS,
        columns: [
          defaultPrimaryColumn,
          {
            name: 'title',
            type: ENUM_COLUMN_TYPES.VARCHAR,
            length: '256',
            isNullable: false,
          },
          {
            name: 'permissionTypeId',
            type: ENUM_COLUMN_TYPES.PRIMARY_KEY,
            isNullable: true,
          },

          ...defaultDateTimeColumns,
          ...defaultColumns,
        ],
        foreignKeys: [
          {
            name: 'fk_permissions_permission_type_id',
            columnNames: ['permissionTypeId'],
            referencedTableName: ENUM_TABLE_NAMES.PERMISSION_TYPES,
            referencedColumnNames: ['id'],
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(ENUM_TABLE_NAMES.PERMISSIONS);

    await queryRunner.dropForeignKey(
      ENUM_TABLE_NAMES.PERMISSIONS,
      table.foreignKeys.find((fk) => fk.columnNames.indexOf('permissionTypeId') !== -1),
    );

    await queryRunner.dropTable(ENUM_TABLE_NAMES.PERMISSIONS);
  }
}
