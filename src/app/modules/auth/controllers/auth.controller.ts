import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Request,
  Response,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@src/app/decorators';
import { ResponseInterceptor } from '@src/app/interceptors';
import { IAuthUser } from '@src/app/interfaces';
import { SuccessResponse } from '@src/app/types';
import { JWT_STRATEGY } from '@src/shared/constants/strategy.constants';
import {
  ChangePasswordDTO,
  LoginDTO,
  RefreshTokenDTO,
  RegisterDTO,
  ResetPasswordDTO,
  VerifyResetPasswordDTO,
} from '../dtos';
import { Authenticate2faDTO } from '../dtos/authenticate2fa.dto';
import { GoogleAuthRequestDTO } from '../dtos/googleAuthRequest.dto';
import { ValidateDTO } from '../dtos/validate.dto';
import { GoogleOAuthGuard } from '../guards/google.guard';
import { AuthService } from '../services/auth.service';
import { AccountVerifyRequestDTO } from '../dtos/accountVerifyRequest.dto';
import { VerifyAccountDTO } from '../dtos/verifyAccount.dto';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  // @Get('sso/callback')
  // async ssoCallBack(
  //   @Query('token') token: string,
  //   @Query('redirectUrl') redirectUrl: string,
  //   @Response() res,
  // ) {
  //   res.redirect(`${redirectUrl}?token=${token}`);
  // }

  // @Post('sso/validate')
  // async validate(@Body() payload: ValidateDTO) {
  //   return this.service.validate(payload);
  // }

  // @Get('auth-request')
  // async authRequest(@Query('redirectUrl') redirectUrl: string) {
  //   return this.service.authRequest(redirectUrl);
  // }

  @Get('google')
  async googleAuthRequest(@Query() query: GoogleAuthRequestDTO, @Response() res) {
    const authorizationUrl = await this.service.googleAuthRequest(query);
    res.redirect(authorizationUrl);
  }

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req, @Response() res) {
    const { user } = req;
    const { state } = req.query;
    const responseData = await this.service.googleLogin(user, state);
    res.redirect(responseData.callBackUrl);
  }

  @Post('login')
  async loginUser(@Body() body: LoginDTO) {
    return this.service.loginUser(body);
  }

  @Post('validate')
  async validate(@Body() body: ValidateDTO): Promise<SuccessResponse> {
    return this.service.validate(body);
  }

  @Post('2fa/turn-on')
  @UseGuards(AuthGuard(JWT_STRATEGY))
  @UseInterceptors(ResponseInterceptor)
  async turnOn2fa(@AuthUser() authUser: IAuthUser): Promise<SuccessResponse> {
    return this.service.turnOn2fa(authUser);
  }

  @Post('2fa/turn-off')
  @UseGuards(AuthGuard(JWT_STRATEGY))
  @UseInterceptors(ResponseInterceptor)
  async turnOff2fa(@AuthUser() authUser: IAuthUser): Promise<SuccessResponse> {
    return this.service.turnOff2fa(authUser);
  }

  @Post('2fa/authenticate')
  // @UseGuards(AuthGuard(JWT_STRATEGY))
  @UseInterceptors(ResponseInterceptor)
  async authenticate2fa(@Body() body: Authenticate2faDTO): Promise<SuccessResponse> {
    return this.service.authenticate2fa(body);
  }

  @Post('register')
  async registerUser(@Body() body: RegisterDTO) {
    return this.service.registerUser(body);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDTO) {
    return this.service.refreshToken(body);
  }

  @Post('account-verify-request')
  async accountVerifyRequest(@Body() body: AccountVerifyRequestDTO) {
    return this.service.accountVerifyRequest(body);
  }

  @Post('account-verify')
  async verifyAccount(@Body() body: VerifyAccountDTO) {
    return this.service.verifyAccount(body);
  }

  @Post('reset-password-request')
  async resetPassword(@Body() body: ResetPasswordDTO) {
    return this.service.resetPassword(body);
  }

  @Post('reset-password-verify')
  async verifyPassword(@Body() body: VerifyResetPasswordDTO) {
    return this.service.verifyResetPassword(body);
  }

  @Patch('change-password')
  async changePassword(@Body() body: ChangePasswordDTO, @AuthUser() authUser: IAuthUser) {
    return this.service.changePassword(body, authUser);
  }
}
