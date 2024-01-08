import { BcryptHelper } from '@src/app/helpers';
import { Role } from '@src/app/modules/acl/entities/role.entity';
import { User } from '@src/app/modules/user/entities/user.entity';
import { UserRole } from '@src/app/modules/user/entities/userRole.entity';
import { ENV } from '@src/env';
import { ENUM_AUTH_PROVIDERS } from '@src/shared';
import { DataSource } from 'typeorm';

export default class UserSeeder {
  constructor(private readonly dataSource: DataSource) {}

  public async run(): Promise<void> {
    const isSuperAdminExist = await this.dataSource.manager.findOne(User, {
      where: { identifier: ENV.seedData.superAdminIdentifier },
    });

    if (!isSuperAdminExist) {
      const bcryptHelper = new BcryptHelper();

      const password = await bcryptHelper.hash(ENV.seedData.superAdminPassword);

      const createdAdminUser = await this.dataSource.manager.save(
        Object.assign(new User(), {
          identifier: ENV.seedData.superAdminIdentifier,
          usename: ENV.seedData.superAdminIdentifier,
          password,
          authProvider: ENUM_AUTH_PROVIDERS.SYSTEM,
          isVerified: true,
        }),
      );

      let superAdminRole = await this.dataSource.manager.findOne(Role, {
        where: {
          title: ENV.seedData.superAdminUser,
        },
      });
      if (!superAdminRole) {
        superAdminRole = await this.dataSource.manager.save(
          Object.assign(new Role(), {
            title: ENV.seedData.superAdminUser,
          }),
        );
      }
      await this.dataSource.manager.save(
        Object.assign(new UserRole(), {
          role: superAdminRole.id,
          user: createdAdminUser?.id,
        }),
      );
    }
  }
}
