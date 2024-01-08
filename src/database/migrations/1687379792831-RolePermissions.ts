import {
  ENUM_COLUMN_TYPES,
  ENUM_TABLE_NAMES,
  defaultColumns,
  defaultDateTimeColumns,
  defaultPrimaryColumn,
} from '@src/shared';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class RolePermissions1687379792831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: ENUM_TABLE_NAMES.ROLE_PERMISSIONS,
        columns: [
          defaultPrimaryColumn,
          {
            name: 'roleId',
            type: ENUM_COLUMN_TYPES.PRIMARY_KEY,
            isNullable: false,
          },
          {
            name: 'permissionId',
            type: ENUM_COLUMN_TYPES.PRIMARY_KEY,
            isNullable: false,
          },
          ...defaultDateTimeColumns,
          ...defaultColumns,
        ],
        foreignKeys: [
          {
            name: 'fk_role_permissions_role_id',
            columnNames: ['roleId'],
            referencedTableName: ENUM_TABLE_NAMES.ROLES,
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION',
          },
          {
            name: 'fk_role_permissions_permission_id',
            columnNames: ['permissionId'],
            referencedTableName: ENUM_TABLE_NAMES.PERMISSIONS,
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
    const table = await queryRunner.getTable(ENUM_TABLE_NAMES.ROLE_PERMISSIONS);
    await queryRunner.dropForeignKey(
      ENUM_TABLE_NAMES.ROLE_PERMISSIONS,
      table.foreignKeys.find((fk) => fk.columnNames.indexOf('roleId') !== -1),
    );
    await queryRunner.dropForeignKey(
      ENUM_TABLE_NAMES.ROLE_PERMISSIONS,
      table.foreignKeys.find((fk) => fk.columnNames.indexOf('permissionId') !== -1),
    );
    await queryRunner.dropTable(ENUM_TABLE_NAMES.ROLE_PERMISSIONS);
  }
}
