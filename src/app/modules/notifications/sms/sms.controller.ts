import { Controller } from '@nestjs/common';
import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
  constructor(private readonly service: SmsService) {}

  //   @Get()
  //   async sendSms() {
  //     return this.service.sendSms({
  //       to: 'zahidhasan065@gmail.com',
  //       subject: 'Hello Zahid 🚀',
  //       html: await this.createHtml(),
  //     });
  //   }
}
