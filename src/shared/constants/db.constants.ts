import { TableColumnOptions } from 'typeorm';

export enum ENUM_TABLE_NAMES {
  GLOBAL_CONFIGS = 'global_configs',
  PERMISSIONS = 'permissions',
  PERMISSION_TYPES = 'permission_types',
  ROLES = 'roles',
  USERS = 'users',
  USER_ROLES = 'user_roles',
  ROLE_PERMISSIONS = 'role_permissions',
}

export enum ENUM_COLUMN_TYPES {
  PRIMARY_KEY = 'uuid',
  INT = 'int',
  FLOAT = 'float',
  TEXT = 'text',
  VARCHAR = 'varchar',
  BOOLEAN = 'boolean',
  TIMESTAMP_UTC = 'timestamp without time zone',
  ENUM = 'enum',
  JSONB = 'jsonb',
}

export const defaultDateTimeColumns: TableColumnOptions[] = [
  {
    name: 'createdAt',
    type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC,
    default: 'NOW()',
    isNullable: true,
  },
  {
    name: 'updatedAt',
    type: ENUM_COLUMN_TYPES.TIMESTAMP_UTC,
    isNullable: true,
  },
];

export const defaultColumns: TableColumnOptions[] = [];

export const defaultPrimaryColumn: TableColumnOptions = {
  name: 'id',
  type: ENUM_COLUMN_TYPES.PRIMARY_KEY,
  isPrimary: true,
  generationStrategy: 'uuid',
  default: 'uuid_generate_v4()',
  isUnique: true,
};
