import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';
import * as fs from 'fs';
import * as path from 'path';
const Util = require('util');
const ReadFile = Util.promisify(fs.readFile);
const Handlebars = require('handlebars');

@Controller('email')
export class EmailController {
  constructor(private readonly service: EmailService) {}

  //   @Get()
  //   async sendEmail() {
  //     return this.service.sendEmail({
  //       to: 'zahidhasan065@gmail.com',
  //       subject: 'Hello Zahid 🚀',
  //       html: await this.createHtml(),
  //     });
  //   }

  //   async createHtml() {
  //     try {
  //       const templatePath = path.join(
  //         process.cwd(),
  //         'views/email-templates/requirements.template.hbs'
  //       );
  //       const content = await ReadFile(templatePath, 'utf8');

  //       const template = Handlebars.compile(content);

  //       return template({
  //         orderId: '123456',
  //       });
  //     } catch (error) {
  //       throw new Error('Cannot create email body');
  //     }
  //   }
}
