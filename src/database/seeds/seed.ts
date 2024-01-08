import { User } from '@src/app/modules/user/entities/user.entity';
import { ENV, ormConfig } from '@src/env';
import { DataSource } from 'typeorm';
import UserSeeder from './user.seeder';
import { Role } from '@src/app/modules/acl/entities/role.entity';
import { UserRole } from '@src/app/modules/user/entities/userRole.entity';
import { GlobalConfig } from '@src/app/modules/globalConfig/entities/globalConfig.entity';
import GlobalConfigSeeder from './globalConfig.seeder';

const dataSource = new DataSource({
  type: 'postgres',
  host: ormConfig.host,
  port: ormConfig.port,
  username: ormConfig.username,
  password: ormConfig.password,
  database: ormConfig.database,
  ssl: ENV.isProduction ? { rejectUnauthorized: false } : false,
  synchronize: false,
  entities: [User, Role, UserRole, GlobalConfig],
});

(async () => {
  const globalConfigSeeder = new GlobalConfigSeeder(dataSource);
  const userSeeder = new UserSeeder(dataSource);

  await dataSource.initialize();
  await userSeeder.run();
  await globalConfigSeeder.run();

  await dataSource.destroy();
})();
