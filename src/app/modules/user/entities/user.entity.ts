import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Column, Entity } from 'typeorm';

@Entity(ENUM_TABLE_NAMES.USERS, { orderBy: { createdAt: 'DESC' } })
export class User extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = ['identifier'];

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 256 })
  identifier?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 256 })
  password?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  firstName?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  lastName?: string;

  @Column({ nullable: true, type: ENUM_COLUMN_TYPES.VARCHAR })
  phoneNumber?: string;

  @Column({ nullable: true, type: ENUM_COLUMN_TYPES.VARCHAR })
  username?: string;

  @Column({ nullable: true, type: ENUM_COLUMN_TYPES.VARCHAR })
  email?: string;

  @Column({ type: ENUM_COLUMN_TYPES.BOOLEAN, nullable: true, default: false })
  isTwoFactorEnabled?: boolean;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  twoFactorSecret?: string;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, length: 256 })
  authProvider?: string;

  @Column({ type: ENUM_COLUMN_TYPES.BOOLEAN, nullable: true, default: false })
  isOtpVerified?: boolean;

  @Column({ type: ENUM_COLUMN_TYPES.VARCHAR, nullable: true })
  otpVerificationMethod?: string;

  @Column({ type: ENUM_COLUMN_TYPES.BOOLEAN, nullable: true, default: false })
  isOtpVerificationRequired?: boolean;

  @Column({ type: ENUM_COLUMN_TYPES.BOOLEAN, nullable: true, default: false })
  isVerified?: boolean;

  constructor() {
    super();
  }
}
