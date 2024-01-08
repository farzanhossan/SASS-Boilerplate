import {
  ENUM_COLUMN_TYPES,
  ENUM_TABLE_NAMES,
  defaultColumns,
  defaultDateTimeColumns,
  defaultPrimaryColumn,
} from '@src/shared';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Users1687380079731 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: ENUM_TABLE_NAMES.USERS,
        columns: [
          defaultPrimaryColumn,
          {
            name: 'identifier',
            type: ENUM_COLUMN_TYPES.VARCHAR,
            length: '256',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: ENUM_COLUMN_TYPES.VARCHAR,
            length: '256',
            isNullable: false,
          },
          {
            name: 'firstName',
            type: ENUM_COLUMN_TYPES.VARCHAR,
            isNullable: true,
          },
          {
            name: 'lastName',
            type: ENUM_COLUMN_TYPES.VARCHAR,
            isNullable: true,
          },
          {
            name: 'phoneNumber',
            type: ENUM_COLUMN_TYPES.VARCHAR,
            isNullable: true,
          },
          {
            name: 'username',
            type: ENUM_COLUMN_TYPES.VARCHAR,
            isNullable: true,
          },
          {
            name: 'email',
            type: ENUM_COLUMN_TYPES.VARCHAR,
            isNullable: true,
          },
          {
            name: 'isTwoFactorEnabled',
            type: ENUM_COLUMN_TYPES.BOOLEAN,
            isNullable: true,
            default: false,
          },
          {
            name: 'twoFactorSecret',
            type: ENUM_COLUMN_TYPES.VARCHAR,
            isNullable: true,
          },
          {
            name: 'authProvider',
            type: ENUM_COLUMN_TYPES.VARCHAR,
            isNullable: true,
          },
          {
            name: 'isOtpVerified',
            type: ENUM_COLUMN_TYPES.BOOLEAN,
            isNullable: true,
            default: false,
          },
          {
            name: 'otpVerificationMethod',
            type: ENUM_COLUMN_TYPES.VARCHAR,
            isNullable: true,
          },
          {
            name: 'isOtpVerificationRequired',
            type: ENUM_COLUMN_TYPES.BOOLEAN,
            isNullable: true,
            default: false,
          },
          {
            name: 'isVerified',
            type: ENUM_COLUMN_TYPES.BOOLEAN,
            isNullable: true,
            default: false,
          },

          ...defaultDateTimeColumns,
          ...defaultColumns,
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(ENUM_TABLE_NAMES.USERS);
  }
}
