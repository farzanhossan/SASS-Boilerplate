import { EmailController } from './email.controller';
import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';

const modules = [];
const services = [EmailService];

@Global()
@Module({
  imports: [...modules],
  providers: [...services],
  exports: [...services],
  controllers: [EmailController],
})
export class EmailModule {}
