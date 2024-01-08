import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from '@src/database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionFilter } from './filters';
import { AclModule } from './modules/acl/acl.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { UniqueValidatorPipe } from './pipes/uniqueValidator.pipe';
import { EmailModule } from './modules/notifications/email/email.module';
import { AuthMiddleware } from './middlewares';
import { HelpersModule } from './helpers/helpers.module';
import { ResponseInterceptor } from './interceptors';

const MODULES = [DatabaseModule, HelpersModule, AuthModule, AclModule, UserModule, EmailModule];
const PIPES = [UniqueValidatorPipe];

@Module({
  imports: [...MODULES],
  controllers: [AppController],
  providers: [
    ...PIPES,
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/auth/change-password', method: RequestMethod.POST });
  }
}
