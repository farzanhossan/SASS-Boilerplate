import { createParamDecorator } from '@nestjs/common';
import { IApiUser } from '../interfaces';

export const ApiUser = createParamDecorator((data, req): IApiUser => {
  return req.args[0].apiCredentials;
});
