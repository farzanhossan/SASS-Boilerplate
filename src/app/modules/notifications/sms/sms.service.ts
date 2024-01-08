import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
  constructor(private readonly http: HttpService) {}

  async sendSms(number: string, message: string) {
    const url = `https://sms.mram.com.bd/smsapi?api_key=R70000036416e8242b1299.93529727&type=text&contacts=${number}&senderid=8809601002828&msg=${message}`;
    const responseData = await this.http.get(url);
    const response = await firstValueFrom(responseData);
    return response;
  }
}
