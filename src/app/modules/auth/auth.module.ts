import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpersModule } from '../../helpers/helpers.module';
import { AclModule } from './../acl/acl.module';
import { UserModule } from './../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { GoogleOAuthGuard } from './guards/google.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthService } from './services/auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { SmsModule } from '../notifications/sms/sms.module';
import { EmailModule } from '../notifications/email/email.module';

const entities = [];
const services = [AuthService];
const subscribers = [];
const controllers = [AuthController];
const webControllers = [];
const internalControllers = [];
const modules = [HelpersModule, UserModule, AclModule, HttpModule, SmsModule, EmailModule];
const strategies = [LocalStrategy, JwtStrategy, GoogleStrategy];
const guards = [RolesGuard, PermissionsGuard, GoogleOAuthGuard];

@Module({
  imports: [TypeOrmModule.forFeature(entities), ...modules],
  providers: [...services, ...subscribers, ...strategies, ...guards],
  exports: [...services, ...subscribers],
  controllers: [...controllers, ...webControllers, ...internalControllers],
})
export class AuthModule {}
