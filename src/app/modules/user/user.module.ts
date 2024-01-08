import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpersModule } from '@src/app/helpers/helpers.module';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { UserRole } from './entities/userRole.entity';
import { UserService } from './services/user.service';
import { UserRoleService } from './services/userRole.service';
import { UserSubscriber } from './subscribers/user.subscriber';
import { AclModule } from '../acl/acl.module';
import { GlobalConfigModule } from '../globalConfig/globalConfig.module';

const entities = [User, UserRole];
const services = [UserService, UserRoleService];
const subscribers = [UserSubscriber];
const controllers = [UserController];
const modules = [HelpersModule, AclModule, GlobalConfigModule];

@Module({
  imports: [TypeOrmModule.forFeature(entities), ...modules],
  providers: [...services, ...subscribers],
  exports: [...services, ...subscribers],
  controllers: [...controllers],
})
export class UserModule {}
