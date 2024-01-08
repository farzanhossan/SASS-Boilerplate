import { SmsController } from './sms.controller';
import { Global, Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { HttpModule } from '@nestjs/axios';

const modules = [HttpModule];
const services = [SmsService];

@Global()
@Module({
  imports: [...modules],
  providers: [...services],
  exports: [...services],
  controllers: [SmsController],
})
export class SmsModule {}
