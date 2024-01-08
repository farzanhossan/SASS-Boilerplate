import { Module } from '@nestjs/common';
import { BcryptHelper } from './bcrypt.helper';
import { EmailHelper } from './email.helper';
import { JWTHelper } from './jwt.helper';

const HELPERS = [BcryptHelper, JWTHelper, EmailHelper];

@Module({
  providers: [...HELPERS],
  exports: [...HELPERS],
})
export class HelpersModule {}
