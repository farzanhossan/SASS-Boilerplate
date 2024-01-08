import { Controller, Get, HttpCode, HttpStatus, Query, Res } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExcludeEndpoint,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Check API status' })
  @ApiOkResponse({ description: 'The service is operating correctly' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiBadRequestResponse({ description: 'Communication error with the server' })
  @ApiServiceUnavailableResponse({
    description: 'The service is not available',
  })
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('login')
  loginRequest(@Res() res: Response) {
    return res.render('login-request', { message: 'Hello world!!' });
  }

  @Get('login/callback')
  loginCallback(@Query() query: any) {
    return query;
  }
}
