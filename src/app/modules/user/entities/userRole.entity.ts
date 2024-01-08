import { BaseEntity } from '@src/app/base';
import { ENUM_TABLE_NAMES } from '@src/shared';
import { Type } from 'class-transformer';
import { Entity, ManyToOne, RelationId } from 'typeorm';
import { Role } from '../../acl/entities/role.entity';
import { User } from './user.entity';

@Entity(ENUM_TABLE_NAMES.USER_ROLES, { orderBy: { createdAt: 'DESC' } })
export class UserRole extends BaseEntity {
  public static readonly SEARCH_TERMS: string[] = [];

  @ManyToOne((t) => Role, { onDelete: 'CASCADE' })
  @Type((t) => Role)
  role?: Role;

  @RelationId((e: UserRole) => e.role)
  roleId?: string;

  @ManyToOne((t) => User, { onDelete: 'CASCADE' })
  @Type((t) => User)
  user?: User;

  @RelationId((e: UserRole) => e.user)
  userId?: string;

  constructor() {
    super();
  }
}
