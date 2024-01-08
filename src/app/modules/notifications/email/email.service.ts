import { Injectable } from '@nestjs/common';
import { IEmailOptions } from '@src/app/interfaces';
import { ENV } from '@src/env';
const MailComposer = require('nodemailer/lib/mail-composer');
const { google } = require('googleapis');

@Injectable()
export class EmailService {
  constructor() {}

  private getGmailService() {
    const { clientId, clientSecret } = ENV.mail.gmail;
    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oAuth2Client.setCredentials(ENV.mail.gmail.tokens);
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    return gmail;
  }

  private encodeMessage(message) {
    return Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private async createMail(options) {
    const mailComposer = new MailComposer(options);
    const message = await mailComposer.compile().build();
    return this.encodeMessage(message);
  }

  async sendEmail(options: IEmailOptions) {
    try {
      const mailOptions: IEmailOptions = {
        to: options.to,
        cc: options.cc,
        replyTo: options.replyTo || 'zahid@uniclienttechnologies.com',
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
        textEncoding: options.textEncoding || 'base64',
        headers: options.headers || [
          { key: 'X-Application-Developer', value: 'Zahid Hasan' },
          { key: 'X-Application-Version', value: 'v1.0.0.2' },
        ],
      };
      const gmail = this.getGmailService();
      const rawMessage = await this.createMail(mailOptions);
      const data = await gmail.users.messages.send({
        userId: 'me',
        resource: {
          raw: rawMessage,
        },
      });
      return data;
    } catch (error) {
      console.log('🚀 ~ file: email.service.ts:59 ~ EmailService ~ sendEmail ~ error:', error);
    }
  }
}
