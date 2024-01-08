import { BaseEntity } from '@src/app/base';
import { ENUM_COLUMN_TYPES, ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity(ENUM_TABLE_NAMES.GLOBAL_CONFIGS, { orderBy: { createdAt: 'DESC' } })
export class GlobalConfig extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = [];

  @Column({ nullable: true, type: ENUM_COLUMN_TYPES.INT, default: 1 })
  otpExpiresInMin?: number;

  @Column({ nullable: true, type: ENUM_COLUMN_TYPES.BOOLEAN, default: false })
  isVarificationRequiredAfterRegister?: boolean;

  @ManyToOne((t) => User, { onDelete: 'NO ACTION' })
  @Type((t) => User)
  updatedBy?: User;

  @RelationId((e: GlobalConfig) => e.updatedBy)
  updatedById?: number;

  constructor() {
    super();
  }
}
